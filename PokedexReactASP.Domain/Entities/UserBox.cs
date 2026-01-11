using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PokedexReactASP.Domain.Entities
{
    public class UserBox
    {
        public int Id { get; set; }
        public string UserId { get; set; } = null!;
        public virtual ApplicationUser User { get; set; } = null!;

        public string Name { get; set; } = "Box";
        public int Order { get; set; } 
        public string BackgroundImage { get; set; } = "default_bg.png";

        public virtual ICollection<UserPokemon> Pokemons { get; set; } = new List<UserPokemon>();
    }
}
