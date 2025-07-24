using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeElevate.Models
{
    [Table("task_assignments")]  // Specify the exact table name
    public class TaskAssignment
    {
        public int Id { get; set; }
        
        [Column("AssignedToUserId")]  // Map to the correct database column
        public int EmployeeId { get; set; }
        
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        
        [Column("AssignedDate")]  // Map to the correct database column
        public DateTime CreatedAt { get; set; }
        
        public DateTime? DueDate { get; set; }
        public bool IsCompleted { get; set; } = false;  // Add the missing property

        public Employee? Employee { get; set; }
    }
}