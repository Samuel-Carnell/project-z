using System;
using System.Linq;
using System.Text.Json;
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

public static class UpdateTaskDescriptionAction
{

  public class UpdateTaskDescriptionRequestBody
  {
    public Guid TaskId { get; set; }

    public NewValue<object> Description { get; set; }
  }

  public static RouteHandlerBuilder WithUpdateTaskDescriptionEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapPost("/action/update-task-description", UpdateTaskDescription);
  }

  public static IResult UpdateTaskDescription([FromBody] UpdateTaskDescriptionRequestBody body, [FromServices] IDbContextConnector dbContextConnector)
  {
    using var dbContext = dbContextConnector.ConnectToDatabase();
    var task = dbContext.Tasks.AsQueryable().Where(x => x.Id == body.TaskId).Single();

    if (!body.Description.MatchesCurrentVersion(task.Description))
    {
      return TypedResults.BadRequest("Version mismatch");
    }

    dbContext.Tasks.UpdateOne(
      task => task.Id == body.TaskId,
      Builders<Task>.Update
        .Set(task => task.Description, VersionedValue<string>.From(JsonSerializer.Serialize(body.Description.Value)))
    );

    OnItemsChanged.Dispatch();

    return TypedResults.Ok();
  }

}