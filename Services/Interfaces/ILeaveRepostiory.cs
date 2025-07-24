using EmployeeElevate.Models;

namespace EmployeeElevate.EmployeeManagementCore.Interfaces
{
    public interface ILeaveRepository
    {
        Task<IEnumerable<Leave>> GetAllLeavesAsync();
        Task<Leave?> GetLeaveByIdAsync(int id);
        Task<Leave> CreateLeaveAsync(Leave leave);
        Task<bool> ApproveLeaveAsync(int id, bool isApproved);
        Task<int> GetLeaveDaysTakenByUserAsync(int userId);
        Task<bool> DeleteLeaveAsync(int id);
    }
}