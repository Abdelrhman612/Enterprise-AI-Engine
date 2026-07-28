using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public sealed class AiController : ControllerBase
    {
        private readonly IAiGatewayService _gatewayService;

        public AiController(IAiGatewayService gatewayService)
        {
            _gatewayService = gatewayService;
        }

        [HttpPost("upload")]
        [RequestSizeLimit(524288000)]
        public async Task<IActionResult> UploadAsync([FromForm] IFormFileCollection files, CancellationToken cancellationToken)
        {
            var response = await _gatewayService.ForwardUploadAsync(files, cancellationToken);
            var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            return File(stream, response.Content.Headers.ContentType?.MediaType ?? "application/json");
        }

        [HttpPost("ask")]
        public async Task<IActionResult> AskAsync([FromBody] ChatRequest request, CancellationToken cancellationToken)
        {
            var response = await _gatewayService.ForwardAskAsync(request, cancellationToken);
            var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            return File(stream, response.Content.Headers.ContentType?.MediaType ?? "application/json");
        }
    }
}
