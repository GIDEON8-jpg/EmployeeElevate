using EmployeeElevate.Data;
using EmployeeElevate.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EmployeeElevate.Repositories
{
    public interface ILeaveRepository
    {
        Task<IEnumerable<Leave>> GetAllAsync();
        Task<Leave?> GetByIdAsync(int id);
        Task<Leave> AddAsync(Leave leave);
        Task<bool> UpdateAsync(Leave leave);
        Task<bool> DeleteAsync(int id);
    }

    public class LeaveRepository : ILeaveRepository
    {
        private readonly AppDbContext _context;

        public LeaveRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Leave>> GetAllAsync()
        {
            return await _context.Leaves.Include(l => l.Employee).ToListAsync();
        }

        public async Task<Leave?> GetByIdAsync(int id)
        {
            return await _context.Leaves.Include(l => l.Employee).FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<Leave> AddAsync(Leave leave)
        {
            _context.Leaves.Add(leave);
            await _context.SaveChangesAsync();
            return leave;
        }

        public async Task<bool> UpdateAsync(Leave leave)
        {
            var existing = await _context.Leaves.FindAsync(leave.Id);
            if (existing == null) return false;

            existing.StartDate = leave.StartDate;
            existing.EndDate = leave.EndDate;
            existing.Days = leave.Days;
            existing.Reason = leave.Reason;
            existing.Status = leave.Status;
            existing.AppliedDate = leave.AppliedDate;
            existing.ApprovedBy = leave.ApprovedBy;
            existing.ApprovedDate = leave.ApprovedDate;
            existing.RejectedBy = leave.RejectedBy;

            existing.RejectedDate = leave.RejectedDate;
            existing.EmployeeId = leave.EmployeeId;
            existing.Employee = leave.Employee;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var leave = await _context.Leaves.FindAsync(id);
            if (leave == null) return false;

            _context.Leaves.Remove(leave);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}