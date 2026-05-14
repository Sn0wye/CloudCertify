using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class AddQuestionMetadataAndAnswerImage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Question",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string[]>(
                name: "Concepts",
                table: "Question",
                type: "text[]",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Domain",
                table: "Question",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Explanation",
                table: "Question",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Images",
                table: "Question",
                type: "text[]",
                nullable: false,
                defaultValue: new string[0]);

            migrationBuilder.AddColumn<int>(
                name: "SelectCount",
                table: "Question",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<string>(
                name: "ServiceCategory",
                table: "Question",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string[]>(
                name: "Services",
                table: "Question",
                type: "text[]",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Answer",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255);

            migrationBuilder.AddColumn<string>(
                name: "Image",
                table: "Answer",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Concepts",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "Domain",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "Explanation",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "Images",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "SelectCount",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "ServiceCategory",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "Services",
                table: "Question");

            migrationBuilder.DropColumn(
                name: "Image",
                table: "Answer");

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Question",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Text",
                table: "Answer",
                type: "character varying(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "character varying(255)",
                oldMaxLength: 255,
                oldNullable: true);
        }
    }
}
