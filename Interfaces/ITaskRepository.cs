using EmployeeElevate.Models;

namespace EmployeeElevate.EmployeeManagementCore.Interfaces
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskAssignment>> GetTasksByUserIdAsync(int userId);
        Task<TaskAssignment?> GetTaskByIdAsync(int id);
        Task<TaskAssignment> CreateTaskAsync(TaskAssignment task);
        Task<bool> UpdateTaskStatusAsync(int taskId, bool isCompleted);
        Task<bool> DeleteTaskAsync(int id);
    }
}