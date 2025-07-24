using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Services;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ChatService _chatService;

        public ChatController(ChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask([FromBody] ChatRequest request)
        {
            var response = await _chatService.GetResponseAsync(request.Prompt);
            return Ok(new { reply = response });
        }
    }

    public class ChatRequest
    {
        public string Prompt { get; set; } = string.Empty;
    }
}
