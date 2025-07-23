using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Models;
using EmployeeElevate.Services;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public AuthController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _employeeService.GetAllAsync();
            return Ok(employees);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(Employee employee)
        {
            var created = await _employeeService.AddAsync(employee);
            return Ok(created);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(string email, string password)
        {
            var employee = await _employeeService.GetByEmailAndPasswordAsync(email, password);
            if (employee == null) return Unauthorized("Invalid credentials.");
            return Ok(employee);
        }
    }
}