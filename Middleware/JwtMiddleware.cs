using EmployeeElevate.EmployeeManagementCore.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EmployeeElevate.EmployeeManagementCore.Interfaces;

namespace EmployeeElevate.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;

        public JwtMiddleware(RequestDelegate next, IConfiguration configuration)
        {
            _next = next;
            _configuration = configuration;
        }

        public async Task Invoke(HttpContext context, IEmployeeService employeeService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                AttachUserToContext(context, employeeService, token);

            await _next(context);
        }

        private void AttachUserToContext(HttpContext context, IEmployeeService employeeService, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = System.TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var employeeId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

                // attach employee to context
                var employee = employeeService.GetEmployeeByIdAsync(employeeId).GetAwaiter().GetResult();

                context.Items["Employee"] = employee;
            }
            catch
            {
                // do nothing if jwt validation fails
                // employee is not attached to context so request won't have access
            }
        }
    }
}
