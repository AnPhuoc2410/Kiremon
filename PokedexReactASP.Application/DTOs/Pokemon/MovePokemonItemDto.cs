namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class MovePokemonItemDto
    {
        public int UserPokemonId { get; set; }
        public int? TargetBoxId { get; set; }
        public bool ToParty { get; set; }
        public int SlotIndex { get; set; }
    }
}
