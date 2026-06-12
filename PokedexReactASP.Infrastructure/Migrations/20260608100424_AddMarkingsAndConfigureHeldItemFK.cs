using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMarkingsAndConfigureHeldItemFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Markings",
                table: "UserPokemon",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPokemon_HeldItemId",
                table: "UserPokemon",
                column: "HeldItemId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPokemon_UserItems_HeldItemId",
                table: "UserPokemon",
                column: "HeldItemId",
                principalTable: "UserItems",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPokemon_UserItems_HeldItemId",
                table: "UserPokemon");

            migrationBuilder.DropIndex(
                name: "IX_UserPokemon_HeldItemId",
                table: "UserPokemon");

            migrationBuilder.DropColumn(
                name: "Markings",
                table: "UserPokemon");
        }
    }
}
