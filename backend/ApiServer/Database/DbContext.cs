
using System;
using System.Linq;
using Database.Models;
using LinqToDB;
using LinqToDB.Data;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Serilog;

namespace Database;

public interface IDbContextConnector
{
  public DbContext ConnectToDatabase();
}

public class DbContext : IDisposable
{
  private readonly MongoClient _connection;

  private DbContext(MongoClient connection)
  {
    _connection = connection;
  }

  public IMongoCollection<Task> Tasks => _connection.GetDatabase("default").GetCollection<Task>("task");

  public IMongoCollection<Status> Statuses => _connection.GetDatabase("default").GetCollection<Status>("status");

  public void Dispose()
  {
  }



  public class Connector : IDbContextConnector
  {

    private readonly string _connectionString;

    public Connector(IConfiguration configuration)
    {
      var connectionString = configuration.GetSection("mongodb").GetValue<string>("connection_string");
      if (configuration is null)
      {
        throw new Exception("No connection string");
      }

      _connectionString = connectionString;
    }

    public DbContext ConnectToDatabase()
    {
      var connection = new MongoClient(_connectionString);
      var dbContext = new DbContext(connection);
      Log.Information($"Connecting to Database with connection string {_connectionString}");
      Seeder.Seed(dbContext);
      return dbContext;
    }
  }
}