
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace Auth;

public static class AuthenticationMiddleware
{

  public static void UseSessionAuthentication(this WebApplication app)
  {
    app.Use(async (context, next) =>
    {
      var endpoint = context.Features.Get<IEndpointFeature>()?.Endpoint;
      var attribute = endpoint?.Metadata.GetMetadata<RequireAuthenticationAttribute>();
      if (attribute is null)
      {
        await next(context);
        return;
      }

      var userInfo = context.GetUserInfo();
      if (userInfo is null)
      {
        context.Response.StatusCode = StatusCodes.Status403Forbidden;
        return;
      }

      await next(context);
    });
  }
}
