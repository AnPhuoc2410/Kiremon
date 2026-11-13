using FluentAssertions;
using Moq;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using System.Linq.Expressions;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokemonCollectionServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IPokemonCacheService> _mockPokemonCache;
        private readonly Mock<IPokemonEnricherService> _mockPokemonEnricher;
        private readonly PokemonCollectionService _service;

        public PokemonCollectionServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockPokemonCache = new Mock<IPokemonCacheService>();
            _mockPokemonEnricher = new Mock<IPokemonEnricherService>();

            _service = new PokemonCollectionService(
                _mockUnitOfWork.Object,
                _mockPokemonCache.Object,
                _mockPokemonEnricher.Object);
        }

        [Fact]
        public async Task GetUserPokemonAsync_ShouldReturnEnrichedListOrderedByCaughtDateDesc()
        {
            // Arrange
            var userPokemonList = new List<UserPokemon>
            {
                new() { Id = 1, UserId = "user1", PokemonApiId = 1, CaughtDate = DateTime.UtcNow.AddDays(-2) },
                new() { Id = 2, UserId = "user1", PokemonApiId = 4, CaughtDate = DateTime.UtcNow }
            };

            _mockUnitOfWork.Setup(u => u.UserPokemon.FindAsync(
                It.IsAny<Expression<Func<UserPokemon, bool>>>(),
                It.IsAny<Func<IQueryable<UserPokemon>, IQueryable<UserPokemon>>>(),
                true))
                .ReturnsAsync(userPokemonList);

            var enrichedList = new List<UserPokemonDto>
            {
                new() { Id = 1, PokemonApiId = 1, CaughtDate = userPokemonList[0].CaughtDate },
                new() { Id = 2, PokemonApiId = 4, CaughtDate = userPokemonList[1].CaughtDate }
            };

            _mockPokemonEnricher.Setup(e => e.EnrichBatchAsync(userPokemonList))
                .ReturnsAsync(enrichedList);

            // Act
            var result = (await _service.GetUserPokemonAsync("user1")).ToList();

            // Assert
            result.Should().HaveCount(2);
            result[0].Id.Should().Be(2); // CaughtDate newer
            result[1].Id.Should().Be(1);
        }

        [Fact]
        public async Task GetUserPokemonByIdAsync_ShouldReturnNull_WhenPokemonNotFound()
        {
            // Arrange
            _mockUnitOfWork.Setup(u => u.UserPokemon.FirstOrDefaultAsync(
                It.IsAny<Expression<Func<UserPokemon, bool>>>(),
                It.IsAny<Func<IQueryable<UserPokemon>, IQueryable<UserPokemon>>>(),
                true))
                .ReturnsAsync((UserPokemon?)null);

            // Act
            var result = await _service.GetUserPokemonByIdAsync("user1", 999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetUserPokemonByIdAsync_ShouldReturnEnrichedDto_WhenPokemonExists()
        {
            // Arrange
            var pokemon = new UserPokemon { Id = 10, UserId = "user1", PokemonApiId = 25 };
            _mockUnitOfWork.Setup(u => u.UserPokemon.FirstOrDefaultAsync(
                It.IsAny<Expression<Func<UserPokemon, bool>>>(),
                It.IsAny<Func<IQueryable<UserPokemon>, IQueryable<UserPokemon>>>(),
                true))
                .ReturnsAsync(pokemon);

            var enrichedDto = new UserPokemonDto { Id = 10, PokemonApiId = 25, Name = "pikachu" };
            _mockPokemonEnricher.Setup(e => e.EnrichAsync(pokemon))
                .ReturnsAsync(enrichedDto);

            // Act
            var result = await _service.GetUserPokemonByIdAsync("user1", 10);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(10);
            result.Name.Should().Be("pikachu");
        }

        [Fact]
        public async Task GetCollectionStatsAsync_ShouldCalculateCorrectStatsAndTypeDistribution()
        {
            // Arrange
            var pokemonList = new List<UserPokemon>
            {
                new() { Id = 1, UserId = "user1", PokemonApiId = 1, IsShiny = true, IsFavorite = true, CurrentLevel = 20, TotalBattles = 5, BattlesWon = 4 },
                new() { Id = 2, UserId = "user1", PokemonApiId = 4, IsShiny = false, IsFavorite = false, CurrentLevel = 30, TotalBattles = 10, BattlesWon = 8 }
            };

            _mockUnitOfWork.Setup(u => u.UserPokemon.FindAsync(
                It.IsAny<Expression<Func<UserPokemon, bool>>>(),
                true))
                .ReturnsAsync(pokemonList);

            var pokeApiMap = new Dictionary<int, PokeApiPokemon>
            {
                [1] = new() { Id = 1, Types = new List<PokeApiType> { new() { Type = new() { Name = "grass" } }, new() { Type = new() { Name = "poison" } } } },
                [4] = new() { Id = 4, Types = new List<PokeApiType> { new() { Type = new() { Name = "fire" } } } }
            };

            _mockPokemonCache.Setup(c => c.GetPokemonBatchAsync(It.IsAny<IEnumerable<int>>()))
                .ReturnsAsync(pokeApiMap);

            // Act
            var stats = await _service.GetCollectionStatsAsync("user1");

            // Assert
            stats.TotalCaught.Should().Be(2);
            stats.UniqueCaught.Should().Be(2);
            stats.ShinyCount.Should().Be(1);
            stats.FavoriteCount.Should().Be(1);
            stats.TotalBattles.Should().Be(15);
            stats.TotalBattlesWon.Should().Be(12);
            stats.HighestLevel.Should().Be(30);
            stats.AverageLevel.Should().Be(25);
            stats.TypeDistribution.Should().ContainKey("grass");
            stats.TypeDistribution.Should().ContainKey("fire");
            stats.TypeDistribution["grass"].Should().Be(1);
            stats.TypeDistribution["fire"].Should().Be(1);
        }

        [Fact]
        public async Task GetPokeSummaryAsync_ShouldReturnEmptySummary_WhenUserHasNoPokemon()
        {
            // Arrange
            _mockUnitOfWork.Setup(u => u.UserPokemon.FindAsync(
                It.IsAny<Expression<Func<UserPokemon, bool>>>(),
                true))
                .ReturnsAsync(new List<UserPokemon>());

            // Act
            var result = await _service.GetPokeSummaryAsync("user_empty");

            // Assert
            result.TotalCaptured.Should().Be(0);
            result.UniqueSpecies.Should().Be(0);
            result.Summary.Should().BeEmpty();
        }

        [Fact]
        public async Task GetPokeSummaryAsync_ShouldGroupSpeciesCorrectly_WhenUserHasPokemon()
        {
            // Arrange
            var pokemonList = new List<UserPokemon>
            {
                new() { Id = 1, UserId = "user1", PokemonApiId = 25 },
                new() { Id = 2, UserId = "user1", PokemonApiId = 25 },
                new() { Id = 3, UserId = "user1", PokemonApiId = 1 }
            };

            _mockUnitOfWork.Setup(u => u.UserPokemon.FindAsync(
                It.IsAny<Expression<Func<UserPokemon, bool>>>(),
                true))
                .ReturnsAsync(pokemonList);

            var pokeApiMap = new Dictionary<int, PokeApiPokemon>
            {
                [25] = new() { Id = 25, Name = "pikachu" },
                [1] = new() { Id = 1, Name = "bulbasaur" }
            };

            _mockPokemonCache.Setup(c => c.GetPokemonBatchAsync(It.IsAny<IEnumerable<int>>()))
                .ReturnsAsync(pokeApiMap);

            // Act
            var result = await _service.GetPokeSummaryAsync("user1");

            // Assert
            result.TotalCaptured.Should().Be(3);
            result.UniqueSpecies.Should().Be(2);
            result.Summary.Should().Contain(s => s.Name == "PIKACHU" && s.Captured == 2);
            result.Summary.Should().Contain(s => s.Name == "BULBASAUR" && s.Captured == 1);
        }
    }
}

