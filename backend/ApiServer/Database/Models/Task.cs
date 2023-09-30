

using System;
using LinqToDB.Mapping;

namespace Database.Models;

public class VersionedValue<T>
{
  public Guid Version { get; set; }

  public T Value { get; set; }

  public static VersionedValue<T> From(T value)
  {
    return new VersionedValue<T>
    {
      Version = Guid.NewGuid(),
      Value = value
    };
  }
}

public class Task
{
  public Guid Id { get; set; }

  public VersionedValue<int> Index { get; set; }

  public VersionedValue<Guid> StatusId { get; set; }

  public VersionedValue<string> Title { get; set; }
}