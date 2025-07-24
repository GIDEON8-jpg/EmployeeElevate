using EmployeeElevate.Models;

public class Leave
{
    public int Id { get; set; }

    public DateTimeOffset StartDate { get; set; }

    public DateTimeOffset EndDate { get; set; }

    public bool IsApproved { get; set; }

    public int EmployeeId { get; set; }

    public Employee? Employee { get; set; }
}