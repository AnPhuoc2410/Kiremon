using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class MovePokemonDto
    {
        public int? TargetBoxId { get; set; } // null if moving to Party
        
        public bool ToParty { get; set; }

        [Range(0, 29, ErrorMessage = "Slot index must be between 0 and 29.")]
        public int SlotIndex { get; set; } // 0-5 if ToParty, 0-29 if To Box
    }
}
