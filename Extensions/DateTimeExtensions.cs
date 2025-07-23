namespace EmployeeElevate.Extensions
{
    public static class DateTimeExtensions
    {
        // Calculates the number of *inclusive* days between two dates
        public static int TotalDaysInclusive(this DateTime startDate, DateTime endDate)
        {
            return (endDate.Date - startDate.Date).Days + 1;
        }

        // Returns true if the deadline is in the past
        public static bool IsOverdue(this DateTime dueDate)
        {
            return dueDate.Date < DateTime.UtcNow.Date;
        }

        // Format date as a friendly string
        public static string ToFriendlyDate(this DateTime dateTime)
        {
            return dateTime.ToString("MMMM dd, yyyy"); // e.g., "July 22, 2025"
        }

        // Calculate business days (excluding weekends)
        public static int BusinessDaysUntil(this DateTime startDate, DateTime endDate)
        {
            int count = 0;
            DateTime current = startDate.Date;

            while (current <= endDate.Date)
            {
                if (current.DayOfWeek != DayOfWeek.Saturday && current.DayOfWeek != DayOfWeek.Sunday)
                    count++;
                current = current.AddDays(1);
            }

            return count;
        }
    }
}