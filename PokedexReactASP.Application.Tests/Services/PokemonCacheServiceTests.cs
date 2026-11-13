using FluentAssertions;
using Moq;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Services;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokemonCacheServiceTests : IDisposable
    {
        private readonly Mock<IPokeApiService> _mockPokeApi;
        private readonly Mock<ICacheService> _mockCache;
        private readonly PokemonCacheService _cacheService;

        public PokemonCacheServiceTests()
        {
            _mockPokeApi = new Mock<IPokeApiService>();
            _mockCache = new Mock<ICacheService>();
            _cacheService = new PokemonCacheService(_mockPokeApi.Object, _mockCache.Object);
        }

        public void Dispose()
        {
            _cacheService.Dispose();
        }

        [Fact]
        public async Task GetPokemonAsync_ById_WhenCacheHit_ShouldReturnCachedAndNotCallApi()
        {
            // Arrange
            var cachedPokemon = new PokeApiPokemon { Id = 25, Name = "pikachu" };
            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_25"))
                .ReturnsAsync(cachedPokemon);

            // Act
            var result = await _cacheService.GetPokemonAsync(25);

            // Assert
            result.Should().BeEquivalentTo(cachedPokemon);
            _mockPokeApi.Verify(p => p.GetPokemonAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task GetPokemonAsync_ById_WhenCacheMiss_ShouldCallApiAndCacheResult()
        {
            // Arrange
            var apiPokemon = new PokeApiPokemon { Id = 25, Name = "pikachu" };
            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_25"))
                .ReturnsAsync((PokeApiPokemon?)null);
            _mockPokeApi.Setup(p => p.GetPokemonAsync(25))
                .ReturnsAsync(apiPokemon);

            // Act
            var result = await _cacheService.GetPokemonAsync(25);

            // Assert
            result.Should().BeEquivalentTo(apiPokemon);
            _mockPokeApi.Verify(p => p.GetPokemonAsync(25), Times.Once);
            _mockCache.Verify(c => c.SetAsync("pokemon_25", apiPokemon, It.IsAny<TimeSpan>()), Times.Once);
        }

        [Fact]
        public async Task GetPokemonAsync_ById_WhenApiReturnsNull_ShouldReturnNullAndNotCache()
        {
            // Arrange
            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_9999"))
                .ReturnsAsync((PokeApiPokemon?)null);
            _mockPokeApi.Setup(p => p.GetPokemonAsync(9999))
                .ReturnsAsync((PokeApiPokemon?)null);

            // Act
            var result = await _cacheService.GetPokemonAsync(9999);

            // Assert
            result.Should().BeNull();
            _mockCache.Verify(c => c.SetAsync(It.IsAny<string>(), It.IsAny<PokeApiPokemon>(), It.IsAny<TimeSpan>()), Times.Never);
        }

        [Fact]
        public async Task GetPokemonAsync_ByName_WhenCacheHit_ShouldReturnCached()
        {
            // Arrange
            var cachedPokemon = new PokeApiPokemon { Id = 1, Name = "bulbasaur" };
            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_name_bulbasaur"))
                .ReturnsAsync(cachedPokemon);

            // Act
            var result = await _cacheService.GetPokemonAsync("Bulbasaur");

            // Assert
            result.Should().BeEquivalentTo(cachedPokemon);
            _mockPokeApi.Verify(p => p.GetPokemonAsync(It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetPokemonAsync_ByName_WhenCacheMiss_ShouldCallApiAndCacheBothKeys()
        {
            // Arrange
            var apiPokemon = new PokeApiPokemon { Id = 1, Name = "bulbasaur" };
            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_name_bulbasaur"))
                .ReturnsAsync((PokeApiPokemon?)null);
            _mockPokeApi.Setup(p => p.GetPokemonAsync("bulbasaur"))
                .ReturnsAsync(apiPokemon);

            // Act
            var result = await _cacheService.GetPokemonAsync("bulbasaur");

            // Assert
            result.Should().BeEquivalentTo(apiPokemon);
            _mockCache.Verify(c => c.SetAsync("pokemon_name_bulbasaur", apiPokemon, It.IsAny<TimeSpan>()), Times.Once);
            _mockCache.Verify(c => c.SetAsync("pokemon_1", apiPokemon, It.IsAny<TimeSpan>()), Times.Once);
        }

        [Fact]
        public async Task GetPokemonBatchAsync_WithCachedAndMissing_ShouldFetchOnlyMissing()
        {
            // Arrange
            var pokemon1 = new PokeApiPokemon { Id = 1, Name = "bulbasaur" };
            var pokemon4 = new PokeApiPokemon { Id = 4, Name = "charmander" };

            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_1"))
                .ReturnsAsync(pokemon1);
            _mockCache.Setup(c => c.GetAsync<PokeApiPokemon>("pokemon_4"))
                .ReturnsAsync((PokeApiPokemon?)null);

            _mockPokeApi.Setup(p => p.GetPokemonAsync(4))
                .ReturnsAsync(pokemon4);

            // Act
            var result = await _cacheService.GetPokemonBatchAsync(new[] { 1, 4, 1 }); // including duplicate

            // Assert
            result.Should().HaveCount(2);
            result[1].Should().BeEquivalentTo(pokemon1);
            result[4].Should().BeEquivalentTo(pokemon4);

            _mockPokeApi.Verify(p => p.GetPokemonAsync(4), Times.Once);
            _mockPokeApi.Verify(p => p.GetPokemonAsync(1), Times.Never);
            _mockCache.Verify(c => c.SetAsync("pokemon_4", pokemon4, It.IsAny<TimeSpan>()), Times.Once);
        }

        [Fact]
        public void InvalidateCache_ShouldCallCacheRemove()
        {
            // Act
            _cacheService.InvalidateCache(25);

            // Assert
            _mockCache.Verify(c => c.Remove("pokemon_25"), Times.Once);
        }
    }
}

