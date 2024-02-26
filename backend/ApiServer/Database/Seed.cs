using System;
using LinqToDB;
using Database.Models;
using Serilog;
using System.Collections.Generic;
using MongoDB.Driver;
using System.Linq;
using MongoDB.Bson;

namespace Database;

public static class Seeder
{
  static Status[] Statuses = new Status[] {
    new Status()
    {
      Id = Guid.NewGuid(),
      Title = VersionedValue<string>.From("Todo") ,
      Index = VersionedValue<int>.From(1),
      Color = VersionedValue<string>.From("text-gray-500")
    },
    new Status()
    {
      Id = Guid.NewGuid(),
      Title = VersionedValue<string>.From("In Progress") ,
      Index = VersionedValue<int>.From(2),
      Color = VersionedValue<string>.From("text-amber-500")
    },
    new Status()
    {
      Id = Guid.NewGuid(),
      Title = VersionedValue<string>.From("Done") ,
      Index = VersionedValue<int>.From(3),
      Color = VersionedValue<string>.From("text-green-600")
    }
  };

  public static void Seed(DbContext dbContext)
  {
    Log.Debug("Seeding");
    if (dbContext.Statuses.AsQueryable().Count() == 0)
    {
      dbContext.Statuses.InsertMany(Statuses);
    }
  }
}