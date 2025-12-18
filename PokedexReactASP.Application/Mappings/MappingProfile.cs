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

            // UserPokemon → UserPokemonDto
            CreateMap<UserPokemon, UserPokemonDto>()
                .ForMember(dest => dest.CustomMoveIds, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.CustomMoveIds)
                        ? src.CustomMoveIds.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(int.Parse).ToList()
                        : null))
                // Server-determined display fields (enriched at runtime)
                .ForMember(dest => dest.NatureDisplay, opt => opt.Ignore())
                .ForMember(dest => dest.GenderDisplay, opt => opt.Ignore())
                .ForMember(dest => dest.Rank, opt => opt.Ignore())
                .ForMember(dest => dest.RankDisplay, opt => opt.Ignore())
                // PokeAPI fields (enriched at runtime)
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
