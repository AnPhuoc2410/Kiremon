using FluentAssertions;
using PokedexReactASP.Application.Common.Helpers;
using Xunit;

namespace PokedexReactASP.Application.Tests.Common
{
    public class HelpersTests
    {
        [Theory]
        [InlineData("pikachu", "Pikachu")]
        [InlineData("CHARMANDER", "CHARMANDER")]
        [InlineData("a", "A")]
        [InlineData("", "")]
        [InlineData(null, null)]
        public void PokemonNameHelper_CapitalizeFirst_ShouldCapitalizeCorrectly(string? input, string? expected)
        {
            // Act
            var result = PokemonNameHelper.CapitalizeFirst(input!);

            // Assert
            result.Should().Be(expected);
        }

        [Theory]
        [InlineData(1, 1100)]
        [InlineData(2, 1200)]
        [InlineData(10, 2000)]
        [InlineData(50, 6000)]
        public void TrainerLevelCalculator_GetExpForNextLevel_ShouldCalculateCorrectFormula(int currentLevel, int expectedExp)
        {
            // Act
            var exp = TrainerLevelCalculator.GetExpForNextLevel(currentLevel);

            // Assert
            exp.Should().Be(expectedExp);
        }

        [Fact]
        public void FriendCodeHelper_Generate_ShouldReturnValid12CharFormatWithHyphens()
        {
            // Act
            var code = FriendCodeHelper.Generate();

            // Assert: Format is XXXX-XXXX-XXXX (14 chars total with 2 hyphens)
            code.Should().HaveLength(14);
            code[4].Should().Be('-');
            code[9].Should().Be('-');

            // Only allowed base characters (no confusing 0, O, 1, I)
            var cleanCode = code.Replace("-", "");
            cleanCode.Should().HaveLength(12);
            cleanCode.Should().NotContainAny("0", "O", "1", "I");
        }
    }
}

