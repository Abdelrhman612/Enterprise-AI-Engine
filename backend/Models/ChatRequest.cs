namespace Backend.Models
{
    public sealed class ChatRequest
    {
        public string Query { get; set; } = string.Empty;
        public string? SessionId { get; set; }
        public int TopK { get; set; } = 5;
    }
}
