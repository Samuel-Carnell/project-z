using System;

namespace Database.Models;

public class Status
{
  public Guid Id { get; set; }

  public required VersionedValue<Guid> ProjectId { get; set; }

  public required VersionedValue<string> Title { get; set; }

  public required VersionedValue<int> Index { get; set; }

  public required VersionedValue<string> Color { get; set; }
}