using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Data;
using Microsoft.EntityFrameworkCore;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PerformanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PerformanceController(AppDbContext context)
        {
            _context = context;
        }

        // Get total tasks assigned and completed for an employee
        [HttpGet("task-summary/{userId}")]
        public async Task<ActionResult<object>> GetTaskSummary(int userId)
        {
            var total = await _context.TaskAssignments.CountAsync(t => t.Id == userId);
            var completed = await _context.TaskAssignments.CountAsync(t => t.Id == userId && t.IsCompleted);

            return Ok(new
            {
                TotalTasks = total,
                CompletedTasks = completed,
                CompletionRate = total > 0 ? (double)completed / total * 100 : 0
            });
        }
    }
}