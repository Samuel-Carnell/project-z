using System;

namespace Database.Models;

public class UserInfo
{
  public Guid Id { get; set; }

  public string Email { get; set; }

  public string Name { get; set; }

  public string AvatarUrl { get; set; }
}