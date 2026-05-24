using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPokemonSpawnMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PokemonSpawnMetadata",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonApiId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Generation = table.Column<int>(type: "integer", nullable: false),
                    PrimaryType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    SecondaryType = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: true),
                    CaptureRate = table.Column<int>(type: "integer", nullable: false),
                    BaseExperience = table.Column<int>(type: "integer", nullable: false),
                    BaseStatTotal = table.Column<int>(type: "integer", nullable: false),
                    IsBaby = table.Column<bool>(type: "boolean", nullable: false),
                    IsLegendary = table.Column<bool>(type: "boolean", nullable: false),
                    IsMythical = table.Column<bool>(type: "boolean", nullable: false),
                    IsDefaultForm = table.Column<bool>(type: "boolean", nullable: false),
                    Habitat = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    EvolvesFromSpecies = table.Column<bool>(type: "boolean", nullable: false),
                    SpawnRarity = table.Column<int>(type: "integer", nullable: false),
                    SpawnWeight = table.Column<double>(type: "double precision", precision: 10, scale: 4, nullable: false),
                    SyncedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonSpawnMetadata", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PokemonSpawnMetadata_PokemonApiId",
                table: "PokemonSpawnMetadata",
                column: "PokemonApiId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonSpawnMetadata_PrimaryType",
                table: "PokemonSpawnMetadata",
                column: "PrimaryType");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonSpawnMetadata_SecondaryType",
                table: "PokemonSpawnMetadata",
                column: "SecondaryType");

            migrationBuilder.CreateIndex(
                name: "IX_PokemonSpawnMetadata_SpawnRarity_Generation_IsDefaultForm",
                table: "PokemonSpawnMetadata",
                columns: new[] { "SpawnRarity", "Generation", "IsDefaultForm" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonSpawnMetadata");
        }
    }
}
