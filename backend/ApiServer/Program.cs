
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Serilog;
using Serilog.Context;
using Serilog.Events;
using QueryEndpoints;
using ActionEndpoints;
using Database;

var builder = WebApplication.CreateBuilder(args);
Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateBootstrapLogger();
builder.Host.UseSerilog((context, services, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
    .MinimumLevel.Override("Microsoft.AspNetCore.Mvc", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Mvc.Formatters.SystemTextJsonInputFormatter", LogEventLevel.Verbose)
    .MinimumLevel.Override("Microsoft.AspNetCore.Server.Kestrel", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Hosting.Diagnostics", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Routing", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.Extensions.Hosting.Internal", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.HostFiltering", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.StaticFiles", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Http.Result", LogEventLevel.Warning)
    .MinimumLevel.Override("Microsoft.AspNetCore.Http.HttpResults", LogEventLevel.Warning)
    .Enrich.FromLogContext()
    .WriteTo.Conditional(x => x.Properties.ContainsKey("RequestId"), writeTo => writeTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] [RequestId: {RequestId}] {Message:lj}{NewLine}{Exception}"))
    .WriteTo.Conditional(x => !x.Properties.ContainsKey("RequestId"), writeTo => writeTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"));
});

// Some code change
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSingleton<IDbContextConnector, DbContext.Connector>();
builder.Services.AddCors(options =>
{
    options.AddPolicy("mypolicy", x => x.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});



var app = builder.Build();
app.UseCors("mypolicy");
app.UseSwagger();
app.UseSwaggerUI();
app.Use(async (context, next) =>
{
    using (LogContext.PushProperty("RequestId", context.TraceIdentifier))
    {
        await next();
    }
});
var group = app.MapGroup("/api");
group.WithGetItemsEndpoint();
group.WithCreateTaskEndpoint();
group.WithMoveTaskEndpoint();
group.WithRenameTaskEndpoint();
group.WithUpdateTaskDescriptionEndpoint();
app.Run();
