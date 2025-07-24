using EmployeeElevate.Models;
using EmployeeElevate.DTOs;

namespace EmployeeElevate.Services.Interfaces
{
    public interface ITaskService
    {
        Task<TaskAssignment?> AssignTaskAsync(TaskAssignmentDto taskDto);
        Task<IEnumerable<TaskAssignment>> GetAllTasksAsync();
        Task<IEnumerable<TaskAssignment>> GetTasksByEmployeeIdAsync(int employeeId);
        Task<TaskAssignment?> UpdateTaskAsync(int taskId, TaskAssignmentDto updatedTask);
        Task<bool> DeleteTaskAsync(int taskId);
    }
}