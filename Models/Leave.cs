namespace EmployeeElevate.Models
{
    public class Leave
    {
        public int Id { get; set; }
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsApproved { get; set; }

        // Navigation property
        public Employee Employee { get; set; }
    }
}