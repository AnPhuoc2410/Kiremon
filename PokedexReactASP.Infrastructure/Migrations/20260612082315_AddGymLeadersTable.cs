using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddGymLeadersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GymLeaders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    BadgeName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Region = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Avatar = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Sprite = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    RosterJson = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GymLeaders", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GymLeaders");
        }
    }
}
