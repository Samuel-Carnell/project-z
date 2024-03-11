using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using Database;
using Database.Models;
using Events;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Driver;

namespace ActionEndpoints;

public static class CreateTaskAction
{

  public class CreateTaskRequestBody
  {
    public required Guid StatusId { get; set; }

    public required string Title { get; set; }

    public required object Description { get; set; }
  }

  public static RouteHandlerBuilder WithCreateTaskEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapPost("/action/create-task", CreateTask);
  }

  public static IResult CreateTask([FromBody] CreateTaskRequestBody body, [FromServices] IDbContextConnector dbContextConnector)
  {
    var dbContext = dbContextConnector.ConnectToDatabase();

    var status = dbContext.Statuses.AsQueryable().SingleOrDefault(x => x.Id == body.StatusId);
    if (status is null)
    {
      return TypedResults.BadRequest($"No status found with id {body.StatusId}");
    }

    dbContext.Tasks.InsertOne(new Task()
    {
      Id = Guid.NewGuid(),
      Index = VersionedValue<int>.From(dbContext.Tasks.AsQueryable().Count()),
      Description = VersionedValue<string>.From(JsonSerializer.Serialize(body.Description)),
      Title = VersionedValue<string>.From(body.Title),
      StatusId = VersionedValue<Guid>.From(body.StatusId)
    });
    OnItemsChanged.Dispatch();

    return TypedResults.Ok();
  }

}