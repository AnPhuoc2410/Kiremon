namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class UserPokemonDto
    {
        public int PokemonId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Nickname { get; set; }
        public string Type1 { get; set; } = string.Empty;
        public string? Type2 { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public DateTime CaughtDate { get; set; }
        public int Level { get; set; }
        public int Experience { get; set; }
        public bool IsFavorite { get; set; }
        
        // Stats from Pokemon
        public int Hp { get; set; }
        public int Attack { get; set; }
        public int Defense { get; set; }
        public int SpecialAttack { get; set; }
        public int SpecialDefense { get; set; }
        public int Speed { get; set; }
    }
}
