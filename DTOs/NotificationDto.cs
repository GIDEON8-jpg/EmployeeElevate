namespace EmployeeElevate.DTOs
{
    public class NotificationDto
    {
        public int RecipientUserId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}