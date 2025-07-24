using EmployeeElevate.Data;
using EmployeeElevate.Models;
using EmployeeElevate.DTOs;
using EmployeeElevate.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EmployeeElevate.Services
{
    public class TaskService : ITaskService
    {
        private readonly AppDbContext _context;  // Fixed: underscore instead of asterisk

        public TaskService(AppDbContext context)
        {
            _context = context;  // Fixed: underscore instead of asterisk
        }

        public async Task<TaskAssignment?> AssignTaskAsync(TaskAssignmentDto taskDto)
        {
            var employee = await _context.Employees.FindAsync(taskDto.EmployeeId);  // Fixed
            if (employee == null) return null;

            var task = new TaskAssignment
            {
                EmployeeId = taskDto.EmployeeId,
                Title = taskDto.Title,
                Description = taskDto.Description,
                DueDate = taskDto.DueDate,
                CreatedAt = DateTime.UtcNow
            };

            _context.TaskAssignments.Add(task);  // Fixed
            await _context.SaveChangesAsync();   // Fixed
            return task;
        }

        public async Task<IEnumerable<TaskAssignment>> GetAllTasksAsync()
        {
            return await _context.TaskAssignments  // Fixed
                                 .Include(t => t.Employee)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<TaskAssignment>> GetTasksByEmployeeIdAsync(int employeeId)
        {
            return await _context.TaskAssignments  // Fixed
                                 .Where(t => t.EmployeeId == employeeId)
                                 .Include(t => t.Employee)
                                 .ToListAsync();
        }

        public async Task<TaskAssignment?> UpdateTaskAsync(int taskId, TaskAssignmentDto updatedTask)
        {
            var task = await _context.TaskAssignments.FindAsync(taskId);  // Fixed
            if (task == null) return null;

            task.Title = updatedTask.Title;
            task.Description = updatedTask.Description;
            task.DueDate = updatedTask.DueDate;

            await _context.SaveChangesAsync();  // Fixed
            return task;
        }

        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            var task = await _context.TaskAssignments.FindAsync(taskId);  // Fixed
            if (task == null) return false;

            _context.TaskAssignments.Remove(task);  // Fixed
            await _context.SaveChangesAsync();     // Fixed
            return true;
        }
    }
}