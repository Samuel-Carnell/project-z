using System;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Nodes;
using Database;
using Events;
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
    var query = () =>
    {
      using var dbContext = dbContextConnector.ConnectToDatabase();
      var tasksQuery = from task in dbContext.Tasks.AsQueryable().ToList()
                       select new
                       {
                         Type = "task",
                         task.Id,
                         task.StatusId,
                         task.Index,
                         task.Title,
                         Description = JsonSerializer.Deserialize<object>(task.Description.Value, new JsonSerializerOptions() { })
                       };
      var statusesQuery = from status in dbContext.Statuses.AsQueryable()
                          select new
                          {
                            Type = "status",
                            status.Id,
                            status.Index,
                            status.Title,
                            status.Color
                          };
      return tasksQuery.ToList().Union<object>(statusesQuery.ToList());
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