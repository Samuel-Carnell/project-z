using System;
using System.Linq;
using Database;
using Database.Models;
using Events;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

namespace ActionEndpoints;

public static class CreateProjectAction
{

  public class CreateProjectRequestBody
  {
    public Guid Id { get; set; }

    public required string Title { get; set; }

    public required string UrlId { get; set; }
  }

  public static RouteHandlerBuilder WithCreateProjectEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapPost("/action/create-project", CreateProject);
  }

  private static Status[] GetStatuses(Guid projectId) => new Status[] {
    new Status()
    {
      Id = Guid.NewGuid(),
      ProjectId = VersionedValue<Guid>.From(projectId),
      Title = VersionedValue<string>.From("Todo") ,
      Index = VersionedValue<int>.From(1),
      Color = VersionedValue<string>.From("text-gray-500")
    },
    new Status()
    {
      Id = Guid.NewGuid(),
      ProjectId = VersionedValue<Guid>.From(projectId),
      Title = VersionedValue<string>.From("In Progress") ,
      Index = VersionedValue<int>.From(2),
      Color = VersionedValue<string>.From("text-amber-500")
    },
    new Status()
    {
      Id = Guid.NewGuid(),
      ProjectId = VersionedValue<Guid>.From(projectId),
      Title = VersionedValue<string>.From("Done") ,
      Index = VersionedValue<int>.From(3),
      Color = VersionedValue<string>.From("text-green-600")
    }
  };

  public static IResult CreateProject([FromBody] CreateProjectRequestBody body, [FromServices] IDbContextConnector dbContextConnector)
  {
    using var dbContext = dbContextConnector.ConnectToDatabase();
    dbContext.Projects.InsertOne(new Project()
    {
      Id = body.Id,
      Title = VersionedValue<string>.From(body.Title),
      UrlId = VersionedValue<string>.From(body.UrlId)
    });
    dbContext.Statuses.InsertMany(GetStatuses(body.Id));

    OnItemsChanged.Dispatch();

    return TypedResults.Ok();
  }

}