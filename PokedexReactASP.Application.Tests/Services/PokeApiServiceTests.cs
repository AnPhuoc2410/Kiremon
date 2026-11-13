using System.Net;
using System.Text;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using PokedexReactASP.Application.Services;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokeApiServiceTests
    {
        private class TestHttpMessageHandler : HttpMessageHandler
        {
            public Func<HttpRequestMessage, HttpResponseMessage> HandlerFunc { get; set; } = _ => new HttpResponseMessage(HttpStatusCode.NotFound);

            protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
            {
                return Task.FromResult(HandlerFunc(request));
            }
        }

        private readonly TestHttpMessageHandler _handler;
        private readonly HttpClient _httpClient;
        private readonly Mock<ILogger<PokeApiService>> _mockLogger;
        private readonly PokeApiService _service;

        public PokeApiServiceTests()
        {
            _handler = new TestHttpMessageHandler();
            _httpClient = new HttpClient(_handler);
            _mockLogger = new Mock<ILogger<PokeApiService>>();
            _service = new PokeApiService(_httpClient, _mockLogger.Object);
        }

        [Fact]
        public async Task GetPokemonAsync_ById_WhenSuccess_ShouldDeserializePokemon()
        {
            // Arrange
            var json = """
            {
                "id": 25,
                "name": "pikachu",
                "height": 4,
                "weight": 60,
                "base_experience": 112,
                "types": [
                    { "slot": 1, "type": { "name": "electric", "url": "https://pokeapi.co/api/v2/type/13/" } }
                ],
                "stats": [
                    { "base_stat": 35, "stat": { "name": "hp" } }
                ]
            }
            """;

            _handler.HandlerFunc = req =>
            {
                req.RequestUri!.ToString().Should().Contain("pokemon/25");
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            };

            // Act
            var result = await _service.GetPokemonAsync(25);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(25);
            result.Name.Should().Be("pikachu");
            result.Type1.Should().Be("electric");
            result.Hp.Should().Be(35);
        }

        [Fact]
        public async Task GetPokemonAsync_ById_WhenNotFound_ShouldReturnNull()
        {
            // Arrange
            _handler.HandlerFunc = _ => new HttpResponseMessage(HttpStatusCode.NotFound);

            // Act
            var result = await _service.GetPokemonAsync(9999);

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetPokemonAsync_ByName_WhenSuccess_ShouldDeserializePokemon()
        {
            // Arrange
            var json = """{ "id": 1, "name": "bulbasaur" }""";
            _handler.HandlerFunc = req =>
            {
                req.RequestUri!.ToString().Should().Contain("pokemon/bulbasaur");
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            };

            // Act
            var result = await _service.GetPokemonAsync("Bulbasaur");

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.Name.Should().Be("bulbasaur");
        }

        [Fact]
        public async Task GetPokemonSpeciesAsync_ById_WhenSuccess_ShouldDeserializeSpecies()
        {
            // Arrange
            var json = """
            {
                "id": 25,
                "name": "pikachu",
                "capture_rate": 190,
                "base_happiness": 50,
                "is_baby": false,
                "is_legendary": false,
                "is_mythical": false,
                "gender_rate": 4
            }
            """;

            _handler.HandlerFunc = req =>
            {
                req.RequestUri!.ToString().Should().Contain("pokemon-species/25");
                return new HttpResponseMessage(HttpStatusCode.OK)
                {
                    Content = new StringContent(json, Encoding.UTF8, "application/json")
                };
            };

            // Act
            var result = await _service.GetPokemonSpeciesAsync(25);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(25);
            result.Capture_Rate.Should().Be(190);
            result.Is_Baby.Should().BeFalse();
            result.Gender_Rate.Should().Be(4);
        }

        [Fact]
        public async Task GetPokemonListAsync_WhenSuccess_ShouldReturnItems()
        {
            // Arrange
            var json = """
            {
                "count": 2,
                "results": [
                    { "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/" },
                    { "name": "ivysaur", "url": "https://pokeapi.co/api/v2/pokemon/2/" }
                ]
            }
            """;

            _handler.HandlerFunc = req => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            // Act
            var result = await _service.GetPokemonListAsync(2, 0);

            // Assert
            result.Should().HaveCount(2);
            result[0].Name.Should().Be("bulbasaur");
            result[1].Name.Should().Be("ivysaur");
        }

        [Fact]
        public async Task GetItemAsync_WhenSuccess_ShouldReturnItem()
        {
            // Arrange
            var json = """
            {
                "id": 1,
                "name": "master-ball",
                "cost": 0,
                "sprites": { "front_default": "https://pokeapi.co/items/master-ball.png" }
            }
            """;

            _handler.HandlerFunc = req => new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(json, Encoding.UTF8, "application/json")
            };

            // Act
            var result = await _service.GetItemAsync(1);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.Name.Should().Be("master-ball");
            result.Sprites?.Front_Default.Should().Be("https://pokeapi.co/items/master-ball.png");
        }
    }
}
