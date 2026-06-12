using System.Collections.Generic;

namespace PokedexReactASP.Application.DTOs.Pokemon
{
    public class BatchMoveResultDto
    {
        public bool Success { get; set; }
        public List<int> AffectedBoxIds { get; set; } = new();
        public bool PartyAffected { get; set; }
    }
}
