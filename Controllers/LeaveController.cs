// Controllers/LeaveController.cs
using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Services;
using EmployeeElevate.Models;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/leaves")]
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

        [HttpGet]
        public async Task<IActionResult> GetAllLeaves()
        {
            var leaves = await _leaveService.GetAllLeavesAsync();
            return Ok(leaves);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveById(int id)
        {
            var leave = await _leaveService.GetLeaveByIdAsync(id);
            if (leave == null) return NotFound();
            return Ok(leave);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeave([FromBody] Leave leave)
        {
            // Convert DateTimeOffset to DateTime (UTC-safe)
            leave.StartDate = leave.StartDate.ToUniversalTime();
            leave.EndDate = leave.EndDate.ToUniversalTime();

            var created = await _leaveService.CreateLeaveAsync(leave);
            return CreatedAtAction(nameof(GetLeaveById), new { id = created.Id }, created);
        }

        [HttpPut("{leaveId}/status")]
        public async Task<IActionResult> UpdateLeaveStatus(int leaveId, [FromQuery] bool isApproved)
        {
            var success = await _leaveService.ApproveLeaveAsync(leaveId, isApproved);
            if (!success) return NotFound();
            return Ok("Leave status updated.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeave(int id)
        {
            var success = await _leaveService.DeleteLeaveAsync(id);
            if (!success) return NotFound();
            return Ok("Leave deleted successfully.");
        }
    }
}