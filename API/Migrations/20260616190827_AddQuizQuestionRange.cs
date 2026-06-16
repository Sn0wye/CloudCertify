using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddQuizQuestionRange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Match the entity's ranged default (40/60) so pre-existing rows stay valid
            // (0 would trip the Min > 0 guard in StartQuiz). Reseed sets exam-specific values.
            migrationBuilder.AddColumn<int>(
                name: "MaxQuestions",
                table: "Quiz",
                type: "integer",
                nullable: false,
                defaultValue: 60);

            migrationBuilder.AddColumn<int>(
                name: "MinQuestions",
                table: "Quiz",
                type: "integer",
                nullable: false,
                defaultValue: 40);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxQuestions",
                table: "Quiz");

            migrationBuilder.DropColumn(
                name: "MinQuestions",
                table: "Quiz");
        }
    }
}
