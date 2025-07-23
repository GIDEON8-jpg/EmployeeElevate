namespace EmployeeElevate.Services
{
    public class ChatBotService
    {
        public string RespondTo(string message)
        {
            if (string.IsNullOrWhiteSpace(message)) return "Can you please rephrase?";
            message = message.ToLower();

            if (message.Contains("leave"))
                return "To apply for leave, go to the leave request section and fill out your leave dates.";
            if (message.Contains("task"))
                return "Tasks are assigned by the HR. You can view yours in the Tasks section.";
            if (message.Contains("help"))
                return "I'm here to help! Ask me anything about your tasks, leave days, or account.";

            return "Sorry, I couldn't understand that. Try asking about leave or tasks.";
        }
    }
}