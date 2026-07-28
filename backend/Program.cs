using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using Backend.Middleware;
using Backend.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    options.JsonSerializerOptions.DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.WithOrigins(builder.Configuration.GetValue<string[]>("AllowedOrigins") ?? new[] { "http://localhost:5173" })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddHttpClient<IAiGatewayService, AiGatewayService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration.GetValue<string>("AiService:BaseUrl") ?? "http://localhost:8000/");
    client.Timeout = TimeSpan.FromSeconds(90);
    client.DefaultRequestHeaders.Accept.Clear();
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
}).ConfigurePrimaryHttpMessageHandler(() => new SocketsHttpHandler
{
    PooledConnectionIdleTimeout = TimeSpan.FromMinutes(5),
    KeepAlivePingPolicy = HttpKeepAlivePingPolicy.Always,
    EnableMultipleHttp2Connections = true,
    AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
    MaxConnectionsPerServer = 50,
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseCors("DefaultPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();
app.MapGet("/", () => Results.Text("Backend Orchestrator is running.", "text/plain"));

app.Run();

