using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeElevate.Models
{
    [Table("leaves")] // PostgreSQL-compatible table name
    public class Leave
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string EmployeeName { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required]
        public string LeaveType { get; set; } = string.Empty;

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [Required]
        public int Days { get; set; }

        [Required]
        public string Reason { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Pending"; // "Pending", "Approved", or "Rejected"

        [Required]
        public DateTime AppliedDate { get; set; }

        public string? ApprovedBy { get; set; }
        public DateTime? ApprovedDate { get; set; }

        public string? RejectedBy { get; set; }
        public DateTime? RejectedDate { get; set; }

        // Optional relationship to Employee
        [ForeignKey("Employee")]
        public int? EmployeeId { get; set; }
        public Employee? Employee { get; set; }
    }
}
