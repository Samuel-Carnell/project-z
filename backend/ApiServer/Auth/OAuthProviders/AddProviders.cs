using System;
using System.Collections.Generic;
using Auth.OAuthProviders;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Auth;

public static class ServiceExtensions
{
  private static T GetProviderConfig<T>(string key, ConfigurationManager configuration) where T : class, new()
  {
    try
    {
      T toBind = new T();
      configuration.GetSection("oauth").Bind(key, toBind);
      return toBind;
    }
    catch (Exception ex)
    {
      Console.WriteLine(ex.Message);
      return null;
    }
  }

  public static void AddOAuthProviders(this IServiceCollection services, ConfigurationManager configuration)
  {
    var service = new Dictionary<string, IOAuthProvider>
      {
        { GithubProvider.ProviderName, new GithubProvider(GetProviderConfig<GithubProvider.Config>("github", configuration)) }
      };

    services.AddSingleton(service);
  }
}