namespace EmployeeElevate.DTOs
{
    public class TaskAssignmentDto
    {
        public int EmployeeId { get; set; } 
        
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int AssignedToUserId { get; set; }
        public DateTime? DueDate { get; set; }
    }
}