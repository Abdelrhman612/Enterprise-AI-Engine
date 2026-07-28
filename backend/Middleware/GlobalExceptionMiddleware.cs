using System.Net;
using System.Text.Json;
using Backend.Models;

namespace Backend.Middleware
{
    public sealed class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception exception)
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";

                var errorResponse = new ErrorResponse
                {
                    Message = "An internal server error occurred.",
                    Detail = exception.Message,
                };

                var payload = JsonSerializer.Serialize(errorResponse, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                });

                await context.Response.WriteAsync(payload);
            }
        }
    }
}
