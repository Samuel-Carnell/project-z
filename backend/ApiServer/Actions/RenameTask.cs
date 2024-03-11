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

public static class RenameTaskAction
{

  public class RenameTaskRequestBody
  {
    public Guid TaskId { get; set; }

    public required NewValue<string> Title { get; set; }
  }

  public static RouteHandlerBuilder WithRenameTaskEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapPost("/action/rename-task", RenameTask);
  }

  public static IResult RenameTask([FromBody] RenameTaskRequestBody body, [FromServices] IDbContextConnector dbContextConnector)
  {
    var dbContext = dbContextConnector.ConnectToDatabase();
    var task = dbContext.Tasks.AsQueryable().Where(x => x.Id == body.TaskId).Single();

    if (!body.Title.MatchesCurrentVersion(task.Title))
    {
      return TypedResults.BadRequest("Version mismatch");
    }

    dbContext.Tasks.UpdateOne(
      task => task.Id == body.TaskId,
      Builders<Task>.Update
        .Set(task => task.Title, VersionedValue<string>.From(body.Title.Value))
    );

    OnItemsChanged.Dispatch();

    return TypedResults.Ok();
  }

}