//TaskAssignmentService ---

using EmployeeElevate.Data;
using EmployeeElevate.Models;
using Microsoft.EntityFrameworkCore;

public class TaskAssignmentService
{
    private readonly AppDbContext _context;

    public TaskAssignmentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskAssignment>> GetTasksForEmployeeAsync(int userId)
    {
        return await _context.TaskAssignments
            .Where(t => t.AssignedToUserId == userId)
            .ToListAsync();
    }

    public async Task<TaskAssignment> CreateTaskAsync(TaskAssignment task)
    {
        _context.TaskAssignments.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<bool> MarkTaskCompleteAsync(int taskId)
    {
        var task = await _context.TaskAssignments.FindAsync(taskId);
        if (task == null) return false;

        task.IsCompleted = true;
        await _context.SaveChangesAsync();
        return true;
    }
}
