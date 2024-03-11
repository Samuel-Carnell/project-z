using System.Threading.Tasks;
using Database.Models;

namespace Auth;

public class UserInfo
{
  public string Email { get; set; }
  public string Name { get; set; }
  public string AvatarUrl { get; set; }
}

public interface IOAuthProvider
{
  public Task<string> GetAccessToken(string authorizationToken);

  public Task<UserInfo> GetUserInfo(string accessToken);
}