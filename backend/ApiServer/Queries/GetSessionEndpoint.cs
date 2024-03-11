using Auth;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace QueryEndpoints;

public static class GetSessionEndpoint
{

  public static IEndpointConventionBuilder WithGetSessionEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapGet("/query/session", (HttpContext context) =>
    {
      var userInfo = context.GetUserInfo();
      return TypedResults.Ok(new
      {
        LoggedIn = userInfo is not null,
        UserInfo = userInfo
      });
    });
  }

}