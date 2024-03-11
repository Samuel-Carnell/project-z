using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Serilog;

namespace Auth;

public static class CurrentUserStore
{
  private static string _currentUserSessionKey = "CurrentUser";

  public static Database.Models.UserInfo? GetUserInfo(this HttpContext httpContext)
  {
    var serializedUserInfo = httpContext.Session.GetString(_currentUserSessionKey);
    Log.Information($"Getting user info {serializedUserInfo}");
    if (serializedUserInfo is null)
    {
      return null;
    }

    return JsonSerializer.Deserialize<Database.Models.UserInfo>(serializedUserInfo);
  }

  public static void SetCurrentUserInfo(this HttpContext httpContext, Database.Models.UserInfo currentUserInfo)
  {
    var serializedUserInfo = JsonSerializer.Serialize(currentUserInfo);
    Log.Information($"Setting user info {serializedUserInfo}");
    httpContext.Session.SetString(_currentUserSessionKey, serializedUserInfo);
  }

}