using EmployeeElevate.Data;
using EmployeeElevate.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeElevate.Services
{
    public class EmployeeService
    {
        private readonly AppDbContext _context;

        public EmployeeService(AppDbContext context)
        {
            _context = context;
        }

        // Get all employees
        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _context.Employees.ToListAsync();
        }

        // Get employee by ID
        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees.FindAsync(id);
        }

        // Add a new employee
        public async Task<Employee> AddAsync(Employee employee)
        {
            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return employee;
        }

        // Update an existing employee
        public async Task<Employee?> UpdateAsync(int id, Employee updated)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return null;

            employee.Name = updated.Name;
            employee.Email = updated.Email;
            employee.Role = updated.Role;
            employee.Password = updated.Password;

            await _context.SaveChangesAsync();
            return employee;
        }

        // Delete employee by ID
        public async Task<bool> DeleteAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        // Authenticate by email and password
        public async Task<Employee?> GetByEmailAndPasswordAsync(string email, string password)
        {
            return await _context.Employees
                .FirstOrDefaultAsync(e => e.Email == email && e.Password == password);
        }
    }
}
