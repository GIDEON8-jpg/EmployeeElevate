using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Models;
using EmployeeElevate.Services.Interfaces;
using EmployeeElevate.DTOs;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        // POST: api/task/assign
        [HttpPost("assign")]
        public async Task<IActionResult> AssignTask([FromBody] TaskAssignmentDto taskDto)
        {
            var task = await _taskService.AssignTaskAsync(taskDto);
            if (task == null)
                return NotFound("Employee not found or task could not be assigned.");
            
            return Ok(task);
        }

        // GET: api/task/all
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _taskService.GetAllTasksAsync();
            return Ok(tasks);
        }

        // GET: api/task/employee/3
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetTasksByEmployeeId(int employeeId)
        {
            var tasks = await _taskService.GetTasksByEmployeeIdAsync(employeeId);
            return Ok(tasks);
        }

        // PUT: api/task/update/5
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] TaskAssignmentDto updatedTask)
        {
            var result = await _taskService.UpdateTaskAsync(id, updatedTask);
            if (result == null)
                return NotFound("Task not found or update failed.");

            return Ok("Task updated successfully.");
        }

        // DELETE: api/task/delete/5
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var deleted = await _taskService.DeleteTaskAsync(id);
            if (!deleted)
                return NotFound("Task not found.");

            return Ok("Task deleted successfully.");
        }
    }
}
