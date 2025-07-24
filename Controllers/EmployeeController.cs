
using Microsoft.AspNetCore.Mvc;
using EmployeeElevate.Models;
using EmployeeElevate.EmployeeManagementCore.Interfaces;
using EmployeeElevate.Services.Interfaces;

namespace EmployeeElevate.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: api/employee/employees
        [HttpGet("employees")]
        public async Task<IActionResult> GetEmployees()
        {
            var employees = await _employeeService.GetAllEmployeesAsync();
            return Ok(employees);
        }

        // GET: api/employee/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null) return NotFound();
            return Ok(employee);
        }

        // POST: api/employee/register
        [HttpPost("register")]
        public async Task<IActionResult> Register(Employee employee)
        {
            var created = await _employeeService.CreateEmployeeAsync(employee);
            return Ok(created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            var result = await _employeeService.UpdateEmployeeAsync(id, employee);

            if (result == null)
                return NotFound("Employee not found or could not be updated.");

            return Ok("Employee updated successfully.");
        }



        // DELETE: api/employee/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            var result = await _employeeService.DeleteEmployeeAsync(id);
            if (!result) return NotFound("Employee not found.");
            return Ok("Employee deleted successfully.");
        }
    }
}
