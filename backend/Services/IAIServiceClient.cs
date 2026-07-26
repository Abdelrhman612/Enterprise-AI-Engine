using backend.Models;

namespace backend.Services;

public interface IAIServiceClient
{
    Task<ChatResponseDto> SendChatMessageAsync(ChatRequestDto request, CancellationToken cancellationToken = default);
}
