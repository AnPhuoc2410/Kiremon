using FluentAssertions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using PokedexReactASP.Application.Common.Helpers;
using PokedexReactASP.Application.Options;
using Xunit;

namespace PokedexReactASP.Application.Tests.Common
{
    public class PokeItemMapperTests
    {
        private readonly PokeItemMapper _mapper;
        private readonly ItemSystemSettings _settings;

        public PokeItemMapperTests()
        {
            _settings = new ItemSystemSettings
            {
                DefaultBoxesCount = 8,
                BoxSlotsMax = 30,
                PocketOverrides = new Dictionary<string, List<string>>
                {
                    { "Pokeballs", new List<string> { "standard-balls", "special-balls" } },
                    { "Medicine", new List<string> { "healing", "status-cures" } },
                    { "Battle Items", new List<string> { "stat-boosts" } }
                }
            };

            var options = Microsoft.Extensions.Options.Options.Create(_settings);
            var mockLogger = new Mock<ILogger<PokeItemMapper>>();

            _mapper = new PokeItemMapper(options, mockLogger.Object);
        }

        [Fact]
        public void DefaultProperties_ShouldMatchSettings()
        {
            _mapper.DefaultBoxesCount.Should().Be(8);
            _mapper.BoxSlotsMax.Should().Be(30);
        }

        [Theory]
        [InlineData("standard-balls", "misc", "Pokeballs")]
        [InlineData("SPECIAL-BALLS", "items", "Pokeballs")]
        [InlineData("healing", "potions", "Medicine")]
        [InlineData("stat-boosts", "battle", "Battle Items")]
        public void ResolvePocket_WithMatchingOverride_ShouldReturnCustomPocket(string category, string apiPocket, string expectedPocket)
        {
            var result = _mapper.ResolvePocket(apiPocket, category);
            result.Should().Be(expectedPocket);
        }

        [Fact]
        public void ResolvePocket_WhenNotInOverrides_ShouldFallbackToApiPocket()
        {
            var result = _mapper.ResolvePocket("Berries", "fresh-berries");
            result.Should().Be("Berries");
        }

        [Theory]
        [InlineData("", "")]
        [InlineData(null, null)]
        [InlineData("", null)]
        [InlineData(null, "")]
        public void ResolvePocket_WhenCategoryAndPocketAreNullOrEmpty_ShouldReturnOther(string? category, string? apiPocket)
        {
            var result = _mapper.ResolvePocket(apiPocket!, category!);
            result.Should().Be("Other");
        }

        [Fact]
        public void ResolvePocket_WhenCategoryEmpty_ShouldReturnApiPocketIfAvailable()
        {
            var result = _mapper.ResolvePocket("Key Items", "");
            result.Should().Be("Key Items");
        }
    }
}
