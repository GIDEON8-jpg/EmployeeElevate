using EmployeeElevate.Models;

namespace EmployeeElevate.EmployeeManagementCore.Interfaces
{
    public interface INotificationSender
    {
        Task<List<Notification>> GetUserNotificationsAsync(int userId);
        Task<Notification?> GetNotificationByIdAsync(int id);
        Task<Notification> CreateNotificationAsync(Notification notification);
        Task<bool> DeleteNotificationAsync(int id);
    }
}