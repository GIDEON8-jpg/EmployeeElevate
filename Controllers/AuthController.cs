using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Models;
using EmployeeElevate.Services.Interfaces;

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
        public async Task<IActionResult> Login(string email, string password)
        {
            var employee = await _employeeService.AuthenticateAsync(email, password);
            if (employee == null) return Unauthorized("Invalid credentials.");
            return Ok(employee);
        }
    }
}