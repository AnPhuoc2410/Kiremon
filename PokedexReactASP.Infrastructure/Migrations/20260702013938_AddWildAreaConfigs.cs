using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWildAreaConfigs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "WildAreaConfigs",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SpawnCount = table.Column<int>(type: "integer", nullable: true),
                    ResetIntervalMinutes = table.Column<int>(type: "integer", nullable: true),
                    AllowedTypes = table.Column<List<string>>(type: "text[]", nullable: false),
                    PreferredTypes = table.Column<List<string>>(type: "text[]", nullable: false),
                    BannedTypes = table.Column<List<string>>(type: "text[]", nullable: false),
                    AllowedHabitats = table.Column<List<string>>(type: "text[]", nullable: false),
                    PreferredHabitats = table.Column<List<string>>(type: "text[]", nullable: false),
                    RequiredAnyTags = table.Column<List<string>>(type: "text[]", nullable: false),
                    PreferredTags = table.Column<List<string>>(type: "text[]", nullable: false),
                    AllowedTags = table.Column<List<string>>(type: "text[]", nullable: false),
                    BannedTags = table.Column<List<string>>(type: "text[]", nullable: false),
                    RequiredAnyTypes = table.Column<List<string>>(type: "text[]", nullable: false),
                    SecondaryAllowedTypes = table.Column<List<string>>(type: "text[]", nullable: false),
                    SafeFallbackPokemonIds = table.Column<List<int>>(type: "integer[]", nullable: false),
                    MinGeneration = table.Column<int>(type: "integer", nullable: true),
                    MaxGeneration = table.Column<int>(type: "integer", nullable: true),
                    AllowLegendary = table.Column<bool>(type: "boolean", nullable: true),
                    AllowMythical = table.Column<bool>(type: "boolean", nullable: true),
                    AllowBaby = table.Column<bool>(type: "boolean", nullable: true),
                    RarityWeights = table.Column<Dictionary<string, double>>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WildAreaConfigs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "WildAreaGlobalSettings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ResetIntervalMinutes = table.Column<int>(type: "integer", nullable: false),
                    SpawnCount = table.Column<int>(type: "integer", nullable: false),
                    MaxAttemptsPerSpawn = table.Column<int>(type: "integer", nullable: false),
                    MaxGeneration = table.Column<int>(type: "integer", nullable: false),
                    AllowLegendarySpawn = table.Column<bool>(type: "boolean", nullable: false),
                    SpawnWeights = table.Column<Dictionary<string, double>>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WildAreaGlobalSettings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WildAreaConfigs_Code",
                table: "WildAreaConfigs",
                column: "Code",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WildAreaConfigs");

            migrationBuilder.DropTable(
                name: "WildAreaGlobalSettings");
        }
    }
}
