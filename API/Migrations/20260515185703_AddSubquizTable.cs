using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddSubquizTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SubquizId",
                table: "Submission",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subquiz",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    QuizId = table.Column<int>(type: "integer", nullable: false),
                    Title = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Domain = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Slug = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subquiz", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Subquiz_Quiz_QuizId",
                        column: x => x.QuizId,
                        principalTable: "Quiz",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Submission_SubquizId",
                table: "Submission",
                column: "SubquizId");

            migrationBuilder.CreateIndex(
                name: "IX_Subquiz_QuizId",
                table: "Subquiz",
                column: "QuizId");

            migrationBuilder.AddForeignKey(
                name: "FK_Submission_Subquiz_SubquizId",
                table: "Submission",
                column: "SubquizId",
                principalTable: "Subquiz",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Submission_Subquiz_SubquizId",
                table: "Submission");

            migrationBuilder.DropTable(
                name: "Subquiz");

            migrationBuilder.DropIndex(
                name: "IX_Submission_SubquizId",
                table: "Submission");

            migrationBuilder.DropColumn(
                name: "SubquizId",
                table: "Submission");
        }
    }
}
