using EmployeeElevate.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeElevate.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        // Tables
        public DbSet<Employee> Employees { get; set; }
        public DbSet<TaskAssignment> TaskAssignments { get; set; }

        public DbSet<Leave> Leaves { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Optional: Set default schema (PostgreSQL uses "public" by default)
            modelBuilder.HasDefaultSchema("public");

            // Optional: Table name overrides for clarity (PostgreSQL is case-sensitive)
            modelBuilder.Entity<Employee>().ToTable("employees");
            modelBuilder.Entity<TaskAssignment>().ToTable("task_assignments");
            modelBuilder.Entity<Leave>().ToTable("leaves");
            modelBuilder.Entity<Notification>().ToTable("notifications");

            // OPTIONAL: Add PostgreSQL-compatible config (e.g., enum mapping, value conversions, etc.)
        }
    }
}