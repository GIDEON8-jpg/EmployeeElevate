public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; } // <- This must exist
    public string Message { get; set; }
    public DateTime CreatedAt { get; set; }
}