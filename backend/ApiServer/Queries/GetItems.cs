using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using Auth;
using Database;
using Events;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using MongoDB.Driver;
using Serilog;

namespace QueryEndpoints;

public static class GetItemsEndpoint
{

  public static System.Threading.Tasks.Task WhenCanceled(this System.Threading.CancellationToken cancellationToken)
  {
    var tcs = new System.Threading.Tasks.TaskCompletionSource<bool>();
    cancellationToken.Register(s => ((System.Threading.Tasks.TaskCompletionSource<bool>)s).SetResult(true), tcs);
    return tcs.Task;
  }


  public static IEndpointConventionBuilder WithGetItemsEndpoint(this IEndpointRouteBuilder endpointRouteBuilder)
  {
    return endpointRouteBuilder.MapGet("/query/items", GetTasks);
  }

  private async static System.Threading.Tasks.Task SendSSEData(this HttpContext context, object data)
  {
    var json = JsonSerializer.Serialize(data, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
    Log.Information($"Sending new data");
    await context.Response.WriteAsync($"event: data\n");
    await context.Response.WriteAsync($"id: {Guid.NewGuid()}\n");
    await context.Response.WriteAsync($"data: {json}\n\n");
    await context.Response.Body.FlushAsync();
  }

  public async static System.Threading.Tasks.Task GetTasks(HttpContext context, [FromServices] IDbContextConnector dbContextConnector)
  {
    var user = context.GetUserInfo();
    if (user is null)
    {
      context.Response.StatusCode = StatusCodes.Status401Unauthorized;
      return;
    }

    var query = () =>
    {
      var dbContext = dbContextConnector.ConnectToDatabase();
      var projectsQuery = from project in dbContext.Projects.AsQueryable()
                          where project.Owner == user.Id
                          select new
                          {
                            Type = "project",
                            project.Id,
                            project.Title,
                            project.UrlId
                          };
      var projects = projectsQuery.ToList();
      var statusesQuery = from status in dbContext.Statuses.AsQueryable()
                          where projects.Select(project => project.Id).Contains(status.ProjectId.Value)
                          select new
                          {
                            Type = "status",
                            status.Id,
                            status.ProjectId,
                            status.Index,
                            status.Title,
                            status.Color,
                          };
      var statuses = statusesQuery.ToList();
      var tasksQuery = from task in dbContext.Tasks.AsQueryable().ToList()
                       where statuses.Select(status => status.Id).Contains(task.StatusId.Value)
                       select new
                       {
                         Type = "task",
                         task.Id,
                         task.StatusId,
                         task.Index,
                         task.Title,
                         Description = new
                         {
                           task.Description.Version,
                           Value = JsonSerializer.Deserialize<object>(task.Description.Value, new JsonSerializerOptions() { })
                         }
                       };
      var tasks = tasksQuery.ToList();
      return projects.Cast<object>()
        .Union(statuses)
        .Union(tasks);
    };

    context.Response.Headers.Add("Content-Type", "text/event-stream");
    context.Response.Headers.Add("Connection", "keep-alive");
    await context.Response.WriteAsync($"event: ping\n\n");
    await context.SendSSEData(query());



    var unsubscribe = OnItemsChanged.Subscribe(async () =>
    {
      await context.SendSSEData(query());
    });

    await context.RequestAborted.WhenCanceled();
    unsubscribe();
  }

}