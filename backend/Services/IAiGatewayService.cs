using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Backend.Models;

namespace Backend.Services
{
    public interface IAiGatewayService
    {
        Task<HttpResponseMessage> ForwardUploadAsync(IFormFileCollection files, CancellationToken cancellationToken);
        Task<HttpResponseMessage> ForwardAskAsync(ChatRequest payload, CancellationToken cancellationToken);
    }
}
