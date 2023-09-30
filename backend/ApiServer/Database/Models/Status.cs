using System;

namespace Database.Models;

public class Status
{
  public Guid Id { get; set; }

  public VersionedValue<string> Title { get; set; }

  public VersionedValue<int> Index { get; set; }

  public VersionedValue<string> Color { get; set; }
}