using AutoMapper;
using FluentAssertions;
using Moq;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Services;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokemonServiceTests
    {
        private readonly Mock<IPokeApiService> _mockPokeApi;
        private readonly Mock<IMapper> _mockMapper;
        private readonly PokemonService _service;

        public PokemonServiceTests()
        {
            _mockPokeApi = new Mock<IPokeApiService>();
            _mockMapper = new Mock<IMapper>();
            _service = new PokemonService(_mockPokeApi.Object, _mockMapper.Object);
        }

        private static PokeApiPokemon CreateSamplePokemon(int id, string name, string type1, string? type2 = null)
        {
            var types = new List<PokeApiType>
            {
                new() { Slot = 1, Type = new() { Name = type1 } }
            };
            if (type2 != null)
            {
                types.Add(new() { Slot = 2, Type = new() { Name = type2 } });
            }

            return new PokeApiPokemon
            {
                Id = id,
                Name = name,
                Height = 7,
                Weight = 69,
                Base_Experience = 64,
                Types = types,
                Stats = new List<PokeApiStat>
                {
                    new() { Base_Stat = 45, Stat = new() { Name = "hp" } },
                    new() { Base_Stat = 49, Stat = new() { Name = "attack" } },
                    new() { Base_Stat = 49, Stat = new() { Name = "defense" } },
                    new() { Base_Stat = 65, Stat = new() { Name = "special-attack" } },
                    new() { Base_Stat = 65, Stat = new() { Name = "special-defense" } },
                    new() { Base_Stat = 45, Stat = new() { Name = "speed" } }
                },
                Abilities = new List<PokeApiAbility>
                {
                    new() { Ability = new() { Name = "overgrow" }, Is_Hidden = false, Slot = 1 }
                },
                Sprites = new PokeApiSprites
                {
                    Front_Default = $"https://pokeapi.co/sprite/{id}.png"
                }
            };
        }

        [Fact]
        public async Task GetPokemonByIdAsync_WhenExists_ShouldReturnMappedDto()
        {
            // Arrange
            var pokemon = CreateSamplePokemon(1, "bulbasaur", "grass", "poison");
            _mockPokeApi.Setup(p => p.GetPokemonAsync(1)).ReturnsAsync(pokemon);

            // Act
            var result = await _service.GetPokemonByIdAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.Name.Should().Be("bulbasaur");
            result.Type1.Should().Be("grass");
            result.Type2.Should().Be("poison");
            result.Hp.Should().Be(45);
            result.Abilities.Should().Be("overgrow");
            result.ImageUrl.Should().Be("https://pokeapi.co/sprite/1.png");
        }

        [Fact]
        public async Task GetPokemonByIdAsync_WhenNotFound_ShouldReturnNull()
        {
            // Arrange
            _mockPokeApi.Setup(p => p.GetPokemonAsync(999)).ReturnsAsync((PokeApiPokemon?)null);

            // Act
            var result = await _service.GetPokemonByIdAsync(999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetAllPokemonAsync_ShouldFetchListAndReturnDtos()
        {
            // Arrange
            var listItems = new List<PokeApiPokemonListItem>
            {
                new() { Name = "bulbasaur", Url = "https://pokeapi.co/api/v2/pokemon/1/" },
                new() { Name = "ivysaur", Url = "https://pokeapi.co/api/v2/pokemon/2/" }
            };

            var pokemon1 = CreateSamplePokemon(1, "bulbasaur", "grass");
            var pokemon2 = CreateSamplePokemon(2, "ivysaur", "grass");

            _mockPokeApi.Setup(p => p.GetPokemonListAsync(151, 0)).ReturnsAsync(listItems);
            _mockPokeApi.Setup(p => p.GetPokemonAsync(1)).ReturnsAsync(pokemon1);
            _mockPokeApi.Setup(p => p.GetPokemonAsync(2)).ReturnsAsync(pokemon2);

            // Act
            var result = await _service.GetAllPokemonAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Select(p => p.Name).Should().Contain(new[] { "bulbasaur", "ivysaur" });
        }

        [Fact]
        public async Task SearchPokemonAsync_ShouldFilterByNameOrType()
        {
            // Arrange
            var listItems = new List<PokeApiPokemonListItem>
            {
                new() { Name = "charmander", Url = "https://pokeapi.co/api/v2/pokemon/4/" },
                new() { Name = "squirtle", Url = "https://pokeapi.co/api/v2/pokemon/7/" }
            };

            var charmander = CreateSamplePokemon(4, "charmander", "fire");
            var squirtle = CreateSamplePokemon(7, "squirtle", "water");

            _mockPokeApi.Setup(p => p.GetPokemonListAsync(151, 0)).ReturnsAsync(listItems);
            _mockPokeApi.Setup(p => p.GetPokemonAsync(4)).ReturnsAsync(charmander);
            _mockPokeApi.Setup(p => p.GetPokemonAsync(7)).ReturnsAsync(squirtle);

            // Act
            var searchByName = await _service.SearchPokemonAsync("char");
            var searchByType = await _service.SearchPokemonAsync("water");

            // Assert
            searchByName.Should().ContainSingle(p => p.Name == "charmander");
            searchByType.Should().ContainSingle(p => p.Name == "squirtle");
        }

        [Fact]
        public async Task UnsupportedOperations_ShouldThrowNotSupportedException()
        {
            // Act & Assert
            await Assert.ThrowsAsync<NotSupportedException>(() => _service.CreatePokemonAsync(new CreatePokemonDto()));
            await Assert.ThrowsAsync<NotSupportedException>(() => _service.UpdatePokemonAsync(1, new CreatePokemonDto()));
            await Assert.ThrowsAsync<NotSupportedException>(() => _service.DeletePokemonAsync(1));
        }
    }
}

