using System.Collections.Generic;
using Auth.OAuthProviders;
using Microsoft.Extensions.DependencyInjection;

namespace Auth;

public static class ServiceExtensions
{
  public static void AddOAuthProviders(this IServiceCollection services)
  {
    services.AddSingleton((_) => new Dictionary<string, IOAuthProvider>
    {
      { GithubProvider.ProviderName, new GithubProvider() }
    });
  }
}