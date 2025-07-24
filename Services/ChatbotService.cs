using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace EmployeeElevate.Services
{
    public class ChatService
    {
        private readonly HttpClient _httpClient;
        private readonly string _baseUrl;
        private readonly string _apiKey;
        private readonly string _model;
        private readonly string _knowledgeBasePath;

        public ChatService(IConfiguration configuration)
        {
            _httpClient = new HttpClient();
            _baseUrl = configuration["Gemini:BaseUrl"] ?? "https://generativelanguage.googleapis.com/v1beta/models/";
            _apiKey = configuration["Gemini:ApiKey"]!;
            _model = configuration["Gemini:Model"] ?? "gemini-pro";
            _knowledgeBasePath = Path.Combine(Directory.GetCurrentDirectory(), "knowledgeBase");
        }

        public async Task<string> GetResponseAsync(string userPrompt)
        {
            string context = LoadRelevantContext(userPrompt);

            string fullPrompt = $"You are an HR assistant. Use the following company documents to answer the question:\n\n{context}\n\nQuestion: {userPrompt}";

            var endpoint = $"{_baseUrl}/{_model}:generateContent?key={_apiKey}";

            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new[]
                        {
                            new { text = fullPrompt }
                        }
                    }
                }
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json"
            );

            var response = await _httpClient.PostAsync(endpoint, content);

            if (!response.IsSuccessStatusCode)
                {
                    var errorBody = await response.Content.ReadAsStringAsync();
                    return $"Error: Gemini API returned {response.StatusCode}\n{errorBody}";
                }


            var responseBody = await response.Content.ReadAsStringAsync();

            try
            {
                using var doc = JsonDocument.Parse(responseBody);

                if (doc.RootElement.TryGetProperty("candidates", out var candidates) &&
                    candidates.GetArrayLength() > 0 &&
                    candidates[0].TryGetProperty("content", out var contentElement) &&
                    contentElement.TryGetProperty("parts", out var parts) &&
                    parts.GetArrayLength() > 0 &&
                    parts[0].TryGetProperty("text", out var textElement))
                {
                    return textElement.GetString() ?? "No response content";
                }

                return "No valid response structure from Gemini.";
            }
            catch (JsonException)
            {
                return "Failed to parse response from Gemini.";
            }
        }

        private string LoadRelevantContext(string userPrompt)
        {
            var files = Directory.GetFiles(_knowledgeBasePath, "*.txt");
            var contextBuilder = new StringBuilder();

            foreach (var file in files)
            {
                var content = File.ReadAllText(file);

                if (content.Contains(userPrompt, StringComparison.OrdinalIgnoreCase) || content.Length < 10000)
                {
                    contextBuilder.AppendLine($"--- {Path.GetFileName(file)} ---\n");
                    contextBuilder.AppendLine(content[..Math.Min(1000, content.Length)]);
                    contextBuilder.AppendLine("\n");
                }
            }

            return contextBuilder.ToString();
        }
    }
}
