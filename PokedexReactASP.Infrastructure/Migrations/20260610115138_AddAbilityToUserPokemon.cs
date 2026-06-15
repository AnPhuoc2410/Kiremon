using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAbilityToUserPokemon : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Ability",
                table: "UserPokemon",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Ability",
                table: "UserPokemon");
        }
    }
}
