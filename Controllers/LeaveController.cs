using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Services;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LeaveController : ControllerBase
    {
        private readonly LeaveService _leaveService;

        public LeaveController(LeaveService leaveService)
        {
            _leaveService = leaveService;
        }

        [HttpGet("taken-days/{employeeId}")]
        public async Task<IActionResult> GetLeaveDaysTaken(int employeeId)
        {
            var totalDays = await _leaveService.GetLeaveDaysTakenByEmployeeAsync(employeeId);
            return Ok(totalDays);
        }
    }
}