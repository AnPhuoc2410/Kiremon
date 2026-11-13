using AutoMapper;
using FluentAssertions;
using Moq;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Mappings;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Application.Services.GameMechanics;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokemonEnricherTests
    {
        private readonly Mock<IPokemonCacheService> _mockCache;
        private readonly Mock<IMapper> _mockMapper;
        private readonly INatureGeneratorService _natureService;
        private readonly PokemonEnricher _enricher;

        public PokemonEnricherTests()
        {
            _mockCache = new Mock<IPokemonCacheService>();
            _mockMapper = new Mock<IMapper>();
            _mockMapper.Setup(m => m.Map<UserPokemonDto>(It.IsAny<UserPokemon>()))
                .Returns<UserPokemon>(p => new UserPokemonDto
                {
                    Id = p.Id,
                    PokemonApiId = p.PokemonApiId,
                    CurrentLevel = p.CurrentLevel,
                    IvHp = p.IvHp,
                    IvAttack = p.IvAttack,
                    IvDefense = p.IvDefense,
                    IvSpecialAttack = p.IvSpecialAttack,
                    IvSpecialDefense = p.IvSpecialDefense,
                    IvSpeed = p.IvSpeed,
                    Nature = p.Nature,
                    Nickname = p.Nickname
                });

            _natureService = new NatureGeneratorService();
            _enricher = new PokemonEnricher(_mockCache.Object, _mockMapper.Object, _natureService);
        }

        [Fact]
        public void EnrichWithCachedData_ShouldCalculateRankAndIvCorrectly()
        {
            // Arrange: Perfect IVs (31 * 6 = 186 -> 100% -> SS Rank)
            var pokemon = new UserPokemon
            {
                Id = 1,
                PokemonApiId = 25,
                Nature = Nature.Hardy,
                CurrentLevel = 50,
                IvHp = 31,
                IvAttack = 31,
                IvDefense = 31,
                IvSpecialAttack = 31,
                IvSpecialDefense = 31,
                IvSpeed = 31
            };

            var pokeApiData = new PokeApiPokemon
            {
                Id = 25,
                Name = "pikachu",
                Stats = new List<PokeApiStat>
                {
                    new() { Base_Stat = 35, Stat = new() { Name = "hp" } },
                    new() { Base_Stat = 55, Stat = new() { Name = "attack" } },
                    new() { Base_Stat = 40, Stat = new() { Name = "defense" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "special-attack" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "special-defense" } },
                    new() { Base_Stat = 90, Stat = new() { Name = "speed" } }
                }
            };

            // Act
            var dto = _enricher.EnrichWithCachedData(pokemon, pokeApiData);

            // Assert
            dto.Rank.Should().Be(PokemonRank.SS);
            dto.RankDisplay.Should().Contain("SS Rank");
            dto.IvTotal.Should().Be(186);
            dto.IvRating.Should().Be("Perfect!");
            dto.CalculatedHp.Should().BeGreaterThan(0);
            dto.MaxHp.Should().Be(dto.CalculatedHp);
        }

        [Fact]
        public void EnrichWithCachedData_ShouldApplyNatureModifiers()
        {
            // Arrange: Adamant Nature (+Attack 1.1x, -SpAtk 0.9x)
            var pokemon = new UserPokemon
            {
                Id = 2,
                PokemonApiId = 1,
                Nature = Nature.Adamant,
                CurrentLevel = 50,
                IvHp = 15,
                IvAttack = 15,
                IvDefense = 15,
                IvSpecialAttack = 15,
                IvSpecialDefense = 15,
                IvSpeed = 15
            };

            var pokeApiData = new PokeApiPokemon
            {
                Id = 1,
                Name = "bulbasaur",
                Stats = new List<PokeApiStat>
                {
                    new() { Base_Stat = 50, Stat = new() { Name = "hp" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "attack" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "defense" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "special-attack" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "special-defense" } },
                    new() { Base_Stat = 50, Stat = new() { Name = "speed" } }
                }
            };

            // Act
            var dto = _enricher.EnrichWithCachedData(pokemon, pokeApiData);

            // Assert: At equal base stat and IV, Attack should be strictly greater than Special Attack
            dto.CalculatedAttack.Should().BeGreaterThan(dto.CalculatedSpecialAttack);
        }

        [Fact]
        public async Task EnrichBatchAsync_ShouldReturnEmpty_WhenListIsEmpty()
        {
            // Act
            var result = await _enricher.EnrichBatchAsync(new List<UserPokemon>());

            // Assert
            result.Should().BeEmpty();
        }

        [Fact]
        public async Task EnrichAsync_ShouldFetchFromCacheAndEnrich()
        {
            // Arrange
            var pokemon = new UserPokemon
            {
                Id = 5,
                PokemonApiId = 4,
                Nature = Nature.Modest,
                Nickname = "Flame"
            };

            var pokeApi = new PokeApiPokemon
            {
                Id = 4,
                Name = "charmander",
                Types = new List<PokeApiType> { new() { Type = new() { Name = "fire" } } }
            };

            _mockCache.Setup(c => c.GetPokemonAsync(4))
                .ReturnsAsync(pokeApi);

            // Act
            var dto = await _enricher.EnrichAsync(pokemon);

            // Assert
            dto.Should().NotBeNull();
            dto.DisplayName.Should().Be("Flame");
            dto.Type1.Should().Be("fire");
        }
    }
}
