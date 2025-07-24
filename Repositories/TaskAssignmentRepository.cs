using EmployeeElevate.Data;
using EmployeeElevate.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmployeeElevate.Repositories
{
    public interface ITaskAssignmentRepository
    {
        Task<IEnumerable<TaskAssignment>> GetAllAsync();
        Task<TaskAssignment?> GetByIdAsync(int id);
        Task<TaskAssignment> AddAsync(TaskAssignment task);
        Task<bool> UpdateAsync(TaskAssignment task);
        Task<bool> DeleteAsync(int id);
    }

    public class TaskAssignmentRepository : ITaskAssignmentRepository
    {
        private readonly AppDbContext _context;

        public TaskAssignmentRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TaskAssignment>> GetAllAsync()
        {
            return await _context.TaskAssignments.ToListAsync();
        }

        public async Task<TaskAssignment?> GetByIdAsync(int id)
        {
            return await _context.TaskAssignments.FindAsync(id);
        }

        public async Task<TaskAssignment> AddAsync(TaskAssignment task)
        {
            _context.TaskAssignments.Add(task);
            await _context.SaveChangesAsync();
            return task;
        }

        public async Task<bool> UpdateAsync(TaskAssignment task)
        {
            var existing = await _context.TaskAssignments.FindAsync(task.Id);
            if (existing == null) return false;

            existing.Title = task.Title;
            existing.Description = task.Description;
            existing.Employee= task.Employee;
            existing.IsCompleted = task.IsCompleted;
            existing.DueDate = task.DueDate;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var task = await _context.TaskAssignments.FindAsync(id);
            if (task == null) return false;

            _context.TaskAssignments.Remove(task);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
