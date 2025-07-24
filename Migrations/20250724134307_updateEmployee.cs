using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeElevate.Migrations
{
    /// <inheritdoc />
    public partial class updateEmployee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Role",
                schema: "public",
                table: "employees",
                newName: "role");

            migrationBuilder.RenameColumn(
                name: "Password",
                schema: "public",
                table: "employees",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Email",
                schema: "public",
                table: "employees",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Name",
                schema: "public",
                table: "employees",
                newName: "position");

            migrationBuilder.AddColumn<string>(
                name: "department",
                schema: "public",
                table: "employees",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "full_name",
                schema: "public",
                table: "employees",
                type: "character varying(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "phone",
                schema: "public",
                table: "employees",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "department",
                schema: "public",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "full_name",
                schema: "public",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "phone",
                schema: "public",
                table: "employees");

            migrationBuilder.RenameColumn(
                name: "role",
                schema: "public",
                table: "employees",
                newName: "Role");

            migrationBuilder.RenameColumn(
                name: "password",
                schema: "public",
                table: "employees",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "email",
                schema: "public",
                table: "employees",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "position",
                schema: "public",
                table: "employees",
                newName: "Name");
        }
    }
}
