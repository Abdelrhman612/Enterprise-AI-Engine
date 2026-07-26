using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddControllers();

// Register the typed HttpClient for AI Service Client
builder.Services.AddHttpClient<IAIServiceClient, AIServiceClient>(client =>
{
    var baseUrl = builder.Configuration["AIService:BaseUrl"]
                  ?? throw new InvalidOperationException("AI Service BaseUrl is not configured.");
    client.BaseAddress = new Uri(baseUrl);
});

// Configure CORS for Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]
                             ?? throw new InvalidOperationException("CORS Allowed Origins are not configured.");
        var origins = allowedOrigins.Split(',', StringSplitOptions.RemoveEmptyEntries);

        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowFrontend");

app.MapControllers();
app.MapGet("/", () => "Server is running...");


app.Run();

