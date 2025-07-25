using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeElevate.Migrations
{
    /// <inheritdoc />
    public partial class updateEmployeeModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "join_date",
                schema: "public",
                table: "employees",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "status",
                schema: "public",
                table: "employees",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "join_date",
                schema: "public",
                table: "employees");

            migrationBuilder.DropColumn(
                name: "status",
                schema: "public",
                table: "employees");
        }
    }
}
