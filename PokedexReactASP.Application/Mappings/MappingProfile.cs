using AutoMapper;
using PokedexReactASP.Application.DTOs.Auth;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Auth mappings
            CreateMap<RegisterDto, ApplicationUser>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.Username))
                .ForMember(dest => dest.DateJoined, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<ApplicationUser, AuthResponseDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName));

            CreateMap<ApplicationUser, UserProfileDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName));

            // Pokemon mappings
            CreateMap<Pokemon, PokemonDto>().ReverseMap();
            CreateMap<CreatePokemonDto, Pokemon>();

            // UserPokemon mappings
            CreateMap<UserPokemon, UserPokemonDto>()
                .ForMember(dest => dest.PokemonId, opt => opt.MapFrom(src => src.Pokemon.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Pokemon.Name))
                .ForMember(dest => dest.Type1, opt => opt.MapFrom(src => src.Pokemon.Type1))
                .ForMember(dest => dest.Type2, opt => opt.MapFrom(src => src.Pokemon.Type2))
                .ForMember(dest => dest.ImageUrl, opt => opt.MapFrom(src => src.Pokemon.ImageUrl))
                .ForMember(dest => dest.Hp, opt => opt.MapFrom(src => src.Pokemon.Hp))
                .ForMember(dest => dest.Attack, opt => opt.MapFrom(src => src.Pokemon.Attack))
                .ForMember(dest => dest.Defense, opt => opt.MapFrom(src => src.Pokemon.Defense))
                .ForMember(dest => dest.SpecialAttack, opt => opt.MapFrom(src => src.Pokemon.SpecialAttack))
                .ForMember(dest => dest.SpecialDefense, opt => opt.MapFrom(src => src.Pokemon.SpecialDefense))
                .ForMember(dest => dest.Speed, opt => opt.MapFrom(src => src.Pokemon.Speed));
        }
    }
}
