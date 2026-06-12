namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class UserBoxDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = "Box";
        public int Order { get; set; }
        public string BackgroundImage { get; set; } = "default_bg.png";
        public int PokemonCount { get; set; }
        public List<UserPokemonDto> Pokemons { get; set; } = new();
    }
}
