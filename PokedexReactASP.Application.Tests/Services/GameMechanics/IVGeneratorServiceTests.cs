using FluentAssertions;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Application.Services.GameMechanics;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services.GameMechanics
{
    public class IVGeneratorServiceTests
    {
        private readonly IVGeneratorService _generator;

        public IVGeneratorServiceTests()
        {
            _generator = new IVGeneratorService();
        }

        [Fact]
        public void GenerateIVs_ShouldGenerateValuesBetween0And31()
        {
            // Arrange
            var context = new IVGenerationContext(
                TrainerLevel: 10,
                IsLegendary: false,
                IsMythical: false,
                IsShiny: false,
                HasShinyCharm: false,
                CatchStreak: 0
            );

            // Act
            for (int i = 0; i < 20; i++)
            {
                var ivs = _generator.GenerateIVs(context);

                // Assert
                ivs.Hp.Should().BeInRange(0, 31);
                ivs.Attack.Should().BeInRange(0, 31);
                ivs.Defense.Should().BeInRange(0, 31);
                ivs.SpecialAttack.Should().BeInRange(0, 31);
                ivs.SpecialDefense.Should().BeInRange(0, 31);
                ivs.Speed.Should().BeInRange(0, 31);
                ivs.Total.Should().BeInRange(0, 186);
            }
        }

        [Fact]
        public void GenerateIVs_WithLegendary_ShouldGuaranteeAtLeastThreeIVs25OrHigher()
        {
            // Arrange
            var context = new IVGenerationContext(
                TrainerLevel: 50,
                IsLegendary: true,
                IsMythical: false,
                IsShiny: false,
                HasShinyCharm: false,
                CatchStreak: 0
            );

            // Act & Assert across 10 trials
            for (int trial = 0; trial < 10; trial++)
            {
                var ivs = _generator.GenerateIVs(context);
                int count25Plus = new[] { ivs.Hp, ivs.Attack, ivs.Defense, ivs.SpecialAttack, ivs.SpecialDefense, ivs.Speed }
                    .Count(val => val >= 25);

                count25Plus.Should().BeGreaterThanOrEqualTo(3, "Legendary Pokemon guarantee at least 3 IVs of 25+");
            }
        }
    }
}
