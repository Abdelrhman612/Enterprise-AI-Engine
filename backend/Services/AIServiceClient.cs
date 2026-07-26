using System.Net.Http.Json;
using backend.Models;

namespace backend.Services;

public class AIServiceClient : IAIServiceClient
{
    private readonly HttpClient _httpClient;

    public AIServiceClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<ChatResponseDto> SendChatMessageAsync(ChatRequestDto request, CancellationToken cancellationToken = default)
    {
        // Send the POST request to the "/chat" endpoint
        var response = await _httpClient.PostAsJsonAsync("chat", request, cancellationToken);

        // Check if the request was successful
        response.EnsureSuccessStatusCode();

        // Deserialize the response JSON into ChatResponseDto
        var result = await response.Content.ReadFromJsonAsync<ChatResponseDto>(cancellationToken: cancellationToken);

        return result ?? throw new InvalidOperationException("Received null response from the AI service.");
    }
}
