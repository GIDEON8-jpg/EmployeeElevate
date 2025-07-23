using EmployeeElevate.Data;
using EmployeeElevate.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeElevate.Services
{
    public class LeaveService
    {
        private readonly AppDbContext _context;

        public LeaveService(AppDbContext context)
        {
            _context = context;
        }

        // Get all leave records including the related Employee data
        public async Task<IEnumerable<Leave>> GetAllLeavesAsync()
        {
            return await _context.Leaves
                .Include(l => l.Employee)   // Include navigation property for Employee
                .ToListAsync();
        }

        // Get a leave record by Id including the related Employee data
        public async Task<Leave?> GetLeaveByIdAsync(int id)
        {
            return await _context.Leaves
                .Include(l => l.Employee)
                .FirstOrDefaultAsync(l => l.Id == id);
        }

        // Create a new leave record
        public async Task<Leave> CreateLeaveAsync(Leave leave)
        {
            _context.Leaves.Add(leave);
            await _context.SaveChangesAsync();
            return leave;
        }

        // Approve or reject a leave request by updating IsApproved flag
        public async Task<bool> ApproveLeaveAsync(int id, bool isApproved)
        {
            var leave = await _context.Leaves.FindAsync(id);
            if (leave == null) return false;

            leave.IsApproved = isApproved;
            await _context.SaveChangesAsync();
            return true;
        }

        // Get total leave days taken by an employee (approved leaves only)
        public async Task<int> GetLeaveDaysTakenByEmployeeAsync(int employeeId)
        {
            var leaves = await _context.Leaves
                .Where(l => l.Employee.Id == employeeId && l.IsApproved)
                .ToListAsync();

            int totalDays = 0;
            foreach (var leave in leaves)
            {
                totalDays += (leave.EndDate.Date - leave.StartDate.Date).Days + 1; // +1 to include both start and end date
            }

            return totalDays;
        }


        // Delete a leave record by Id
        public async Task<bool> DeleteLeaveAsync(int id)
        {
            var leave = await _context.Leaves.FindAsync(id);
            if (leave == null) return false;

            _context.Leaves.Remove(leave);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
