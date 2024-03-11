using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Database;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using MongoDB.Driver;

namespace Auth;

public static class SignInEndpoint
{
  private static HttpClient httpClient = new HttpClient();

  public static RouteHandlerBuilder WithSignInEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapGet("/sign-in/oauth/{oauthProvider}", SignIn);
  }

  public static async Task<IResult> SignIn(
    [FromServices] Dictionary<string, IOAuthProvider> oauthProviders,
    [FromServices] IDbContextConnector dbContextConnector,
    [FromRoute] string oauthProvider,
    [FromQuery] string code,
    HttpContext httpContext)
  {
    IOAuthProvider provider = oauthProviders[oauthProvider];
    string accessToken = await provider.GetAccessToken(code);
    UserInfo userInfo = await provider.GetUserInfo(accessToken);

    var dbContext = dbContextConnector.ConnectToDatabase();
    var existingUser = dbContext.Users.Find(x => x.Email == userInfo.Email).SingleOrDefault();
    if (existingUser is null)
    {
      var user = new Database.Models.UserInfo()
      {
        Id = Guid.NewGuid(),
        Email = userInfo.Email,
        AvatarUrl = userInfo.AvatarUrl,
        Name = userInfo.Name
      };
      dbContext.Users.InsertOne(user);
      httpContext.SetCurrentUserInfo(user);
    }
    else
    {
      httpContext.SetCurrentUserInfo(existingUser);
    }


    return TypedResults.Ok();
  }

}