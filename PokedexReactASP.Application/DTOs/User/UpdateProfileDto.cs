using System.ComponentModel.DataAnnotations;

namespace PokedexReactASP.Application.DTOs.User
{
    public class UpdateProfileDto
    {
        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        [Url]
        public string? AvatarUrl { get; set; }
    }
}
