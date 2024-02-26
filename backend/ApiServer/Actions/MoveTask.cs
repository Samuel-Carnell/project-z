using System;
using System.Linq;
using Database;
using Database.Models;
using Events;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using MongoDB.Driver;
using Serilog;

namespace ActionEndpoints;

public class NewValue<T>
{
  public Guid FromVersion { get; set; }

  public T Value { get; set; }

  public bool MatchesCurrentVersion<P>(VersionedValue<P> current)
  {
    return FromVersion == current.Version;
  }
}

public static class MoveTaskAction
{

  public class MoveTaskRequestBody
  {
    public Guid TaskId { get; set; }

    public NewValue<Guid> StatusId { get; set; }
  }

  public static RouteHandlerBuilder WithMoveTaskEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapPost("/action/move-task", MoveTask);
  }

  public static IResult MoveTask([FromBody] MoveTaskRequestBody body, [FromServices] IDbContextConnector dbContextConnector)
  {
    using var dbContext = dbContextConnector.ConnectToDatabase();
    var task = dbContext.Tasks.AsQueryable().Where(x => x.Id == body.TaskId).Single();

    if (!body.StatusId.MatchesCurrentVersion(task.StatusId))
    {
      return TypedResults.BadRequest("Version mismatch");
    }

    dbContext.Tasks.UpdateOne(
      task => task.Id == body.TaskId,
      Builders<Task>.Update
        .Set(task => task.StatusId, VersionedValue<Guid>.From(body.StatusId.Value))
    );

    OnItemsChanged.Dispatch();

    return TypedResults.Ok();
  }

}