using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Services;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatBotController : ControllerBase
    {
        private readonly ChatBotService _chatBotService;

        public ChatBotController(ChatBotService chatBotService)
        {
            _chatBotService = chatBotService;
        }

        [HttpGet("ask")]
        public IActionResult Ask(string message)
        {
            var response = _chatBotService.RespondTo(message);
            return Ok(response);
        }
    }
}