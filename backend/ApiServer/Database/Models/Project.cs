using System;

namespace Database.Models;

public class Project
{
  public Guid Id { get; set; }

  public required VersionedValue<string> Title { get; set; }

  public required VersionedValue<string> UrlId { get; set; }
}