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
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName))
                .ForMember(dest => dest.TwoFactorEnabled, opt => opt.MapFrom(src => src.TwoFactorEnabled));

            CreateMap<ApplicationUser, UserProfileDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName));

            CreateMap<SocialUserDto, ApplicationUser>()
                .ForMember(dest => dest.DateJoined, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.LastActiveDate, opt => opt.MapFrom(src => DateTime.UtcNow));

            // UserPokemon → UserPokemonDto (basic fields only, PokeAPI fields are enriched at runtime)
            CreateMap<UserPokemon, UserPokemonDto>()
                .ForMember(dest => dest.CustomMoveIds, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.CustomMoveIds)
                        ? src.CustomMoveIds.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                        : null))
                // PokeAPI fields - will be enriched at runtime
                .ForMember(dest => dest.Name, opt => opt.Ignore())
                .ForMember(dest => dest.DisplayName, opt => opt.Ignore())
                .ForMember(dest => dest.Type1, opt => opt.Ignore())
                .ForMember(dest => dest.Type2, opt => opt.Ignore())
                .ForMember(dest => dest.SpriteUrl, opt => opt.Ignore())
                .ForMember(dest => dest.OfficialArtworkUrl, opt => opt.Ignore())
                .ForMember(dest => dest.Abilities, opt => opt.Ignore())
                .ForMember(dest => dest.Height, opt => opt.Ignore())
                .ForMember(dest => dest.Weight, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                // Base stats from PokeAPI
                .ForMember(dest => dest.BaseHp, opt => opt.Ignore())
                .ForMember(dest => dest.BaseAttack, opt => opt.Ignore())
                .ForMember(dest => dest.BaseDefense, opt => opt.Ignore())
                .ForMember(dest => dest.BaseSpecialAttack, opt => opt.Ignore())
                .ForMember(dest => dest.BaseSpecialDefense, opt => opt.Ignore())
                .ForMember(dest => dest.BaseSpeed, opt => opt.Ignore())
                .ForMember(dest => dest.BaseStatTotal, opt => opt.Ignore())
                // Calculated fields
                .ForMember(dest => dest.CalculatedHp, opt => opt.Ignore())
                .ForMember(dest => dest.CalculatedAttack, opt => opt.Ignore())
                .ForMember(dest => dest.CalculatedDefense, opt => opt.Ignore())
                .ForMember(dest => dest.CalculatedSpecialAttack, opt => opt.Ignore())
                .ForMember(dest => dest.CalculatedSpecialDefense, opt => opt.Ignore())
                .ForMember(dest => dest.CalculatedSpeed, opt => opt.Ignore())
                .ForMember(dest => dest.MaxHp, opt => opt.Ignore())
                .ForMember(dest => dest.IvTotal, opt => opt.Ignore())
                .ForMember(dest => dest.IvRating, opt => opt.Ignore())
                .ForMember(dest => dest.EvTotal, opt => opt.Ignore())
                .ForMember(dest => dest.WinRate, opt => opt.Ignore())
                .ForMember(dest => dest.FriendshipLevel, opt => opt.Ignore())
                .ForMember(dest => dest.ExperienceToNextLevel, opt => opt.Ignore())
                .ForMember(dest => dest.TimeSinceCaught, opt => opt.Ignore())
                .ForMember(dest => dest.EvolutionChain, opt => opt.Ignore());

            // CatchPokemonDto → UserPokemon
            CreateMap<CatchPokemonDto, UserPokemon>()
                .ForMember(dest => dest.CurrentLevel, opt => opt.MapFrom(src => src.CaughtLevel))
                .ForMember(dest => dest.CaughtDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.LastInteractionDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Friendship, opt => opt.MapFrom(src => 70))
                .ForMember(dest => dest.CurrentHp, opt => opt.MapFrom(src => 100));

            // UserPokemon → UserPokemonSummaryDto
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
