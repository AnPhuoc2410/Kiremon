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

            CreateMap<SocialUserDto, ApplicationUser>()
                .ForMember(dest => dest.DateJoined, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.LastActiveDate, opt => opt.MapFrom(src => DateTime.UtcNow));

            CreateMap<UserPokemon, UserPokemonDto>()
                .ForMember(dest => dest.CustomMoveIds, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.CustomMoveIds)
                        ? src.CustomMoveIds.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                        : null));

            // CatchPokemonDto to UserPokemon
            CreateMap<CatchPokemonDto, UserPokemon>()
                .ForMember(dest => dest.CurrentLevel, opt => opt.MapFrom(src => src.CaughtLevel))
                .ForMember(dest => dest.CaughtDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.LastInteractionDate, opt => opt.MapFrom(src => DateTime.UtcNow));

            // UserPokemon summary mapping
            CreateMap<UserPokemon, UserPokemonSummaryDto>()
                .ForMember(dest => dest.Name, opt => opt.Ignore())
                .ForMember(dest => dest.DisplayName, opt => opt.Ignore())
                .ForMember(dest => dest.Type1, opt => opt.Ignore())
                .ForMember(dest => dest.Type2, opt => opt.Ignore())
                .ForMember(dest => dest.SpriteUrl, opt => opt.Ignore())
                .ForMember(dest => dest.MaxHp, opt => opt.Ignore());
        }
    }
}
