using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace PokedexReactASP.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddFriendshipFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AllowFriendRequests",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "FriendCode",
                table: "AspNetUsers",
                type: "character varying(14)",
                maxLength: 14,
                nullable: false,
                defaultValue: "");

            // Generate unique friend codes for all existing users
            migrationBuilder.Sql(@"
                DO $$
                DECLARE
                    user_record RECORD;
                    new_code VARCHAR(14);
                    chars VARCHAR(32) := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
                    code_exists BOOLEAN;
                BEGIN
                    FOR user_record IN SELECT ""Id"" FROM ""AspNetUsers"" WHERE ""FriendCode"" = '' OR ""FriendCode"" IS NULL
                    LOOP
                        LOOP
                            new_code := '';
                            FOR i IN 1..4 LOOP
                                new_code := new_code || substr(chars, floor(random() * 32 + 1)::int, 1);
                            END LOOP;
                            new_code := new_code || '-';
                            FOR i IN 1..4 LOOP
                                new_code := new_code || substr(chars, floor(random() * 32 + 1)::int, 1);
                            END LOOP;
                            new_code := new_code || '-';
                            FOR i IN 1..4 LOOP
                                new_code := new_code || substr(chars, floor(random() * 32 + 1)::int, 1);
                            END LOOP;
                            
                            SELECT EXISTS(SELECT 1 FROM ""AspNetUsers"" WHERE ""FriendCode"" = new_code) INTO code_exists;
                            
                            IF NOT code_exists THEN
                                UPDATE ""AspNetUsers"" SET ""FriendCode"" = new_code WHERE ""Id"" = user_record.""Id"";
                                EXIT;
                            END IF;
                        END LOOP;
                    END LOOP;
                END $$;
            ");

            migrationBuilder.CreateTable(
                name: "FriendRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    SenderId = table.Column<string>(type: "text", nullable: false),
                    ReceiverId = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SentAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    RespondedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    Message = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FriendRequests", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FriendRequests_AspNetUsers_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_FriendRequests_AspNetUsers_SenderId",
                        column: x => x.SenderId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Friendships",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    User1Id = table.Column<string>(type: "text", nullable: false),
                    User2Id = table.Column<string>(type: "text", nullable: false),
                    FriendsSince = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FriendshipLevel = table.Column<int>(type: "integer", nullable: false),
                    SharedExperience = table.Column<int>(type: "integer", nullable: false),
                    TradesCompleted = table.Column<int>(type: "integer", nullable: false),
                    BattlesTogether = table.Column<int>(type: "integer", nullable: false),
                    User1NicknameForUser2 = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    User2NicknameForUser1 = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LastInteraction = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Friendships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Friendships_AspNetUsers_User1Id",
                        column: x => x.User1Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Friendships_AspNetUsers_User2Id",
                        column: x => x.User2Id,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_FriendCode",
                table: "AspNetUsers",
                column: "FriendCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_ReceiverId",
                table: "FriendRequests",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_SenderId",
                table: "FriendRequests",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_SenderId_ReceiverId",
                table: "FriendRequests",
                columns: new[] { "SenderId", "ReceiverId" });

            migrationBuilder.CreateIndex(
                name: "IX_FriendRequests_Status",
                table: "FriendRequests",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User1Id",
                table: "Friendships",
                column: "User1Id");

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User1Id_User2Id",
                table: "Friendships",
                columns: new[] { "User1Id", "User2Id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Friendships_User2Id",
                table: "Friendships",
                column: "User2Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FriendRequests");

            migrationBuilder.DropTable(
                name: "Friendships");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_FriendCode",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "AllowFriendRequests",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "FriendCode",
                table: "AspNetUsers");
        }
    }
}
