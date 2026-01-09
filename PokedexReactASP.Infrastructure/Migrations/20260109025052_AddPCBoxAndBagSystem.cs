using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPCBoxAndBagSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BoxId",
                table: "UserPokemon",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HeldItemApiId",
                table: "UserPokemon",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsInParty",
                table: "UserPokemon",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "SlotIndex",
                table: "UserPokemon",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserBoxes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    BackgroundImage = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserBoxes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserBoxes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserItems",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<string>(type: "text", nullable: false),
                    ItemApiId = table.Column<int>(type: "integer", nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    SpriteUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    PocketName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    CategoryName = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    IsHoldable = table.Column<bool>(type: "boolean", nullable: false),
                    IsConsumable = table.Column<bool>(type: "boolean", nullable: false),
                    UsableInBattle = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserItems_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserPokemon_BoxId",
                table: "UserPokemon",
                column: "BoxId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPokemon_UserId_IsInParty_SlotIndex",
                table: "UserPokemon",
                columns: new[] { "UserId", "IsInParty", "SlotIndex" });

            migrationBuilder.CreateIndex(
                name: "IX_UserBoxes_UserId",
                table: "UserBoxes",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserItems_UserId_ItemApiId",
                table: "UserItems",
                columns: new[] { "UserId", "ItemApiId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserItems_UserId_PocketName",
                table: "UserItems",
                columns: new[] { "UserId", "PocketName" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserPokemon_UserBoxes_BoxId",
                table: "UserPokemon",
                column: "BoxId",
                principalTable: "UserBoxes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPokemon_UserBoxes_BoxId",
                table: "UserPokemon");

            migrationBuilder.DropTable(
                name: "UserBoxes");

            migrationBuilder.DropTable(
                name: "UserItems");

            migrationBuilder.DropIndex(
                name: "IX_UserPokemon_BoxId",
                table: "UserPokemon");

            migrationBuilder.DropIndex(
                name: "IX_UserPokemon_UserId_IsInParty_SlotIndex",
                table: "UserPokemon");

            migrationBuilder.DropColumn(
                name: "BoxId",
                table: "UserPokemon");

            migrationBuilder.DropColumn(
                name: "HeldItemApiId",
                table: "UserPokemon");

            migrationBuilder.DropColumn(
                name: "IsInParty",
                table: "UserPokemon");

            migrationBuilder.DropColumn(
                name: "SlotIndex",
                table: "UserPokemon");
        }
    }
}
