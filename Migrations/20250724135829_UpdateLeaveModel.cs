using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EmployeeElevate.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLeaveModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_leaves_employees_EmployeeId",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "IsApproved",
                schema: "public",
                table: "leaves");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                schema: "public",
                table: "leaves",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<DateTime>(
                name: "AppliedDate",
                schema: "public",
                table: "leaves",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "ApprovedBy",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedDate",
                schema: "public",
                table: "leaves",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Days",
                schema: "public",
                table: "leaves",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Department",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "EmployeeName",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LeaveType",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Reason",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "RejectedBy",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RejectedDate",
                schema: "public",
                table: "leaves",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                schema: "public",
                table: "leaves",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddForeignKey(
                name: "FK_leaves_employees_EmployeeId",
                schema: "public",
                table: "leaves",
                column: "EmployeeId",
                principalSchema: "public",
                principalTable: "employees",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_leaves_employees_EmployeeId",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "AppliedDate",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "ApprovedDate",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "Days",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "Department",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "EmployeeName",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "LeaveType",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "Reason",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "RejectedBy",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "RejectedDate",
                schema: "public",
                table: "leaves");

            migrationBuilder.DropColumn(
                name: "Status",
                schema: "public",
                table: "leaves");

            migrationBuilder.AlterColumn<int>(
                name: "EmployeeId",
                schema: "public",
                table: "leaves",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsApproved",
                schema: "public",
                table: "leaves",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_leaves_employees_EmployeeId",
                schema: "public",
                table: "leaves",
                column: "EmployeeId",
                principalSchema: "public",
                principalTable: "employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
