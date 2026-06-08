using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RefactorPhase2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaysPlayed",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HoursPlayed",
                table: "AspNetUsers");

            migrationBuilder.CreateIndex(
                name: "IX_UserPokemon_UserId_CaughtDate",
                table: "UserPokemon",
                columns: new[] { "UserId", "CaughtDate" });

            migrationBuilder.CreateIndex(
                name: "IX_UserPokemon_UserId_IsShiny",
                table: "UserPokemon",
                columns: new[] { "UserId", "IsShiny" });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_LastActiveDate",
                table: "AspNetUsers",
                column: "LastActiveDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_UserPokemon_UserId_CaughtDate",
                table: "UserPokemon");

            migrationBuilder.DropIndex(
                name: "IX_UserPokemon_UserId_IsShiny",
                table: "UserPokemon");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_LastActiveDate",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "DaysPlayed",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HoursPlayed",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
