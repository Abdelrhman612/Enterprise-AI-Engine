using System.Net.Http.Headers;
using System.Net.Http.Json;
using Backend.Models;
using Microsoft.AspNetCore.Http;

namespace Backend.Services
{
    public sealed class AiGatewayService : IAiGatewayService
    {
        private readonly HttpClient _httpClient;

        public AiGatewayService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<HttpResponseMessage> ForwardUploadAsync(IFormFileCollection files, CancellationToken cancellationToken)
        {
            if (files.Count == 0)
            {
                throw new ArgumentException("Upload requires at least one file.", nameof(files));
            }

            using var content = new MultipartFormDataContent();
            foreach (var file in files)
            {
                var streamContent = new StreamContent(file.OpenReadStream());
                streamContent.Headers.ContentType = MediaTypeHeaderValue.Parse(file.ContentType ?? "application/octet-stream");
                content.Add(streamContent, "files", file.FileName);
            }

            var response = await _httpClient.PostAsync("upload", content, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            response.EnsureSuccessStatusCode();
            return response;
        }

        public async Task<HttpResponseMessage> ForwardAskAsync(ChatRequest payload, CancellationToken cancellationToken)
        {
            var response = await _httpClient.PostAsJsonAsync("ask", payload, cancellationToken);
            response.EnsureSuccessStatusCode();
            return response;
        }
    }
}
