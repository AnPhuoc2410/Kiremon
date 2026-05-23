using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddWildAreaAndTcgCardRewardSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TcgCardCaches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TcgCardId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PokemonApiId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Supertype = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Rarity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RarityTier = table.Column<int>(type: "integer", nullable: false),
                    SetId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SetName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    ImageSmall = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ImageLarge = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    CachedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TcgCardCaches", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserTcgCards",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    TcgCardId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    PokemonApiId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Supertype = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Rarity = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    RarityTier = table.Column<int>(type: "integer", nullable: false),
                    SetId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    SetName = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: true),
                    ImageSmall = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    ImageLarge = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<int>(type: "integer", nullable: false),
                    ObtainedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserTcgCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserTcgCards_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WildAreaSpawns",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    PokemonApiId = table.Column<int>(type: "integer", nullable: false),
                    AreaCode = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    SlotIndex = table.Column<int>(type: "integer", nullable: false),
                    SpawnRarity = table.Column<int>(type: "integer", nullable: false),
                    SpawnedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MaxAttempts = table.Column<int>(type: "integer", nullable: false),
                    AttemptsUsed = table.Column<int>(type: "integer", nullable: false),
                    IsCaught = table.Column<bool>(type: "boolean", nullable: false),
                    IsConsumed = table.Column<bool>(type: "boolean", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WildAreaSpawns", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WildAreaSpawns_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TcgCardCaches_PokemonApiId_TcgCardId",
                table: "TcgCardCaches",
                columns: new[] { "PokemonApiId", "TcgCardId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTcgCards_PokemonApiId",
                table: "UserTcgCards",
                column: "PokemonApiId");

            migrationBuilder.CreateIndex(
                name: "IX_UserTcgCards_UserId_TcgCardId",
                table: "UserTcgCards",
                columns: new[] { "UserId", "TcgCardId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WildAreaSpawns_UserId_IsActive_ExpiresAt",
                table: "WildAreaSpawns",
                columns: new[] { "UserId", "IsActive", "ExpiresAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TcgCardCaches");

            migrationBuilder.DropTable(
                name: "UserTcgCards");

            migrationBuilder.DropTable(
                name: "WildAreaSpawns");
        }
    }
}
