// Controllers/NotificationController.cs

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Services;
using EmployeeElevate.Models;
using EmployeeElevate.Services;
using Microsoft.EntityFrameworkCore; // Important for async LINQ methods


namespace EmployeeElevate.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationController(NotificationService service)
    {
        _notificationService = service;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAllForUser()
    {
        var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(notifications);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromBody] Notification notification)
    {
        var created = await _notificationService.CreateNotificationAsync(notification);
        return CreatedAtAction(nameof(GetAllForUser), new { }, created);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _notificationService.DeleteNotificationAsync(id);
        return success ? NoContent() : NotFound();
    }
}