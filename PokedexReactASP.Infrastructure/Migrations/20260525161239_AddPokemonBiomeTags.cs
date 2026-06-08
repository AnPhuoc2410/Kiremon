using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPokemonBiomeTags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PokemonBiomeTags",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PokemonApiId = table.Column<int>(type: "integer", nullable: false),
                    Tag = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Weight = table.Column<double>(type: "double precision", precision: 10, scale: 4, nullable: false),
                    IsManual = table.Column<bool>(type: "boolean", nullable: false),
                    Source = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonBiomeTags", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PokemonBiomeTags_PokemonApiId_Tag",
                table: "PokemonBiomeTags",
                columns: new[] { "PokemonApiId", "Tag" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PokemonBiomeTags_Tag",
                table: "PokemonBiomeTags",
                column: "Tag");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PokemonBiomeTags");
        }
    }
}
