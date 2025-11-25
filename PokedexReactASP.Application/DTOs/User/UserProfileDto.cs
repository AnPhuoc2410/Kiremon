namespace PokedexReactASP.Application.DTOs.User
{
    public class UserProfileDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime DateJoined { get; set; }
        public int PokemonCaught { get; set; }
        public int Level { get; set; }
        public int Experience { get; set; }
    }
}
