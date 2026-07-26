using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IAIServiceClient _aiServiceClient;

    public ChatController(IAIServiceClient aiServiceClient)
    {
        _aiServiceClient = aiServiceClient;
    }

    [HttpPost]
    public async Task<IActionResult> Chat([FromBody] ChatRequestDto request, CancellationToken cancellationToken)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Message))
        {
            return BadRequest("Message cannot be empty.");
        }

        try
        {
            var response = await _aiServiceClient.SendChatMessageAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (HttpRequestException ex)
        {
            // Handling external service downtime gracefully
            return StatusCode(502, $"AI Service is currently unreachable. Error: {ex.Message}");
        }
        catch (Exception ex)
        {
            // Catching any other unexpected errors
            return StatusCode(500, $"An error occurred: {ex.Message}");
        }
    }
}
