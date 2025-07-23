namespace EmployeeElevate.DTOs
{
    public class TaskDto
    {
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int AssignedToUserId { get; set; }
        public DateTime? DueDate { get; set; }
    }
}