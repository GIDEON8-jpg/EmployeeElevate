using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeElevate.Models
{
    [Table("employees")] // Explicit table name for PostgreSQL (case-insensitive)
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("full_name")]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [MaxLength(150)]
        [Column("email")]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("password")]
        public string Password { get; set; } = string.Empty;

        [NotMapped] // Not stored in the database, used for validation only
        public string ConfirmPassword { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("role")]
        public string Role { get; set; } = "employee";

        [MaxLength(100)]
        [Column("department")]
        public string Department { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("position")]
        public string Position { get; set; } = string.Empty;

        [Phone]
        [MaxLength(20)]
        [Column("phone")]
        public string Phone { get; set; } = string.Empty;

        [Column("join_date")]
        public DateTime JoinDate { get; set; } = DateTime.Now;

        [Column("status")]
        public bool Status { get; set; } = true;
    }
}
