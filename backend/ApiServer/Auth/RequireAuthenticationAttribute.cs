using System;

namespace Auth;

[AttributeUsage(AttributeTargets.Method)]
public class RequireAuthenticationAttribute : Attribute
{
}