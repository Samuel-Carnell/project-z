using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;
using ByteDev.FormUrlEncoded;
using Serilog;

namespace Auth.OAuthProviders;

public static class Extensions
{
  public static string ToQueryString(this Dictionary<string, string> dict)
  {
    var array = (
        from kvp in dict
        select string.Format(
            "{0}={1}",
            HttpUtility.UrlEncode(kvp.Key),
            HttpUtility.UrlEncode(kvp.Value))
        ).ToArray();
    return "?" + string.Join("&", array);
  }

}

class AccessTokenResponse
{
  [FormUrlEncodedPropertyName("access_token")]
  public string AccessToken { get; set; }
}

class UserResponse
{
  public string Name { get; set; }

  public string AvatarUrl { get; set; }
}

class EmailResponseListItem
{
  public bool Primary { get; set; }

  public string Email { get; set; }
}


public class GithubProvider : IOAuthProvider
{
  public class Config
  {
    public string ClientId { get; set; }
    public string ClientSecret { get; set; }
  }

  public static string ProviderName => "github";

  private HttpClient httpClient = new HttpClient();

  private Config _config;

  public GithubProvider(Config config)
  {
    Console.WriteLine($"Instantiated github provider with {JsonSerializer.Serialize(config)}");
    _config = config;
  }

  private async Task<T> GetFromEndpoint<T>(string endpoint, string accessToken)
  {
    var request = new HttpRequestMessage(HttpMethod.Get, endpoint);
    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
    request.Headers.UserAgent.ParseAdd("APIServer/1.0");

    try
    {
      var response = await httpClient.SendAsync(request);
      return await response.Content.ReadFromJsonAsync<T>();
    }
    catch (Exception ex)
    {
      throw new Exception($"Failed to call endpoint {endpoint}.\nHttpRequest {request}", ex);
    }
  }

  public async Task<string> GetAccessToken(string authorizationToken)
  {
    var authorizeParams = new Dictionary<string, string> {
      { "client_id", _config.ClientId },
      { "client_secret", _config.ClientSecret },
      { "code", authorizationToken }
    };
    try
    {
      var response = await httpClient.GetAsync($"https://github.com/login/oauth/access_token{authorizeParams.ToQueryString()}");
      return FormUrlEncodedSerializer.Deserialize<AccessTokenResponse>(await response.Content.ReadAsStringAsync()).AccessToken;
    }
    catch (Exception ex)
    {
      throw new Exception($"Failed to call endpoint https://github.com/login/oauth/access_token{authorizeParams.ToQueryString()}", ex);
    }
  }

  public async Task<UserInfo> GetUserInfo(string accessToken)
  {
    var user = await GetFromEndpoint<UserResponse>("https://api.github.com/user", accessToken);
    var emails = await GetFromEndpoint<List<EmailResponseListItem>>("https://api.github.com/user/emails", accessToken);
    return new UserInfo
    {
      Name = user.Name,
      AvatarUrl = user.AvatarUrl,
      Email = emails.Single(email => email.Primary).Email
    };
  }
}