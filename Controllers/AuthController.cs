using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Models;
using EmployeeElevate.Services.Interfaces;
using EmployeeElevate.DTOs;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public AuthController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Employee employee)
        {
            var created = await _employeeService.CreateEmployeeAsync(employee);
            return Ok(created);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var employee = await _employeeService.AuthenticateAsync(loginDto.Email, loginDto.Password);
            if (employee == null) return Unauthorized(new { message = "Invalid credentials." });
            
            // Map to UserDto to exclude password
            var userDto = new UserDto
            {
                Id = employee.Id,
                FullName = employee.FullName,
                Email = employee.Email,
                Role = employee.Role,
                Department = employee.Department,
                Position = employee.Position,
                Phone = employee.Phone,
                JoinDate = employee.JoinDate,
                Status = employee.Status
            };
            
            return Ok(new { user = userDto, message = "Login successful" });
        }
    }
}