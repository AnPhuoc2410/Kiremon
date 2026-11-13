using FluentAssertions;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Application.Services.GameMechanics;
using PokedexReactASP.Domain.Enums;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services.GameMechanics
{
    public class CatchRateCalculatorServiceTests
    {
        private readonly CatchRateCalculatorService _calculator;

        public CatchRateCalculatorServiceTests()
        {
            _calculator = new CatchRateCalculatorService();
        }

        private static CatchCalculationContext CreateContext(
            int baseCaptureRate = 45,
            bool isLegendary = false,
            bool isMythical = false,
            bool isBaby = false,
            int pokemonLevel = 20,
            int currentHp = 50,
            int maxHp = 100,
            string? statusCondition = null,
            int trainerLevel = 25,
            PokeballType pokeballUsed = PokeballType.Pokeball,
            bool hasCaughtBefore = false,
            TimeOfDay timeOfDay = TimeOfDay.Day,
            LocationType locationType = LocationType.Grassland,
            int turnCount = 1)
        {
            return new CatchCalculationContext(
                baseCaptureRate,
                isLegendary,
                isMythical,
                isBaby,
                pokemonLevel,
                currentHp,
                maxHp,
                statusCondition,
                trainerLevel,
                pokeballUsed,
                hasCaughtBefore,
                timeOfDay,
                locationType,
                turnCount);
        }

        [Fact]
        public void CalculateCatch_WithMasterBall_ShouldAlwaysSucceedWithThreeShakes()
        {
            // Arrange
            var ctx = CreateContext(
                baseCaptureRate: 3,
                pokemonLevel: 70,
                currentHp: 200,
                maxHp: 200,
                trainerLevel: 1,
                pokeballUsed: PokeballType.MasterBall,
                isLegendary: true
            );

            // Act
            var result = _calculator.CalculateCatch(ctx);

            // Assert
            result.Result.Should().Be(CatchAttemptResult.Success);
            result.ShakeCount.Should().Be(3);
            result.CatchRateUsed.Should().Be(100);
            result.FailReason.Should().BeEmpty();
        }

        [Fact]
        public void GetCatchRatePercent_WithMasterBall_ShouldReturn100()
        {
            // Arrange
            var ctx = CreateContext(
                baseCaptureRate: 3,
                pokemonLevel: 50,
                currentHp: 100,
                maxHp: 100,
                trainerLevel: 5,
                pokeballUsed: PokeballType.MasterBall,
                isLegendary: true
            );

            // Act
            var percent = _calculator.GetCatchRatePercent(ctx);

            // Assert
            percent.Should().Be(100);
        }

        [Fact]
        public void GetCatchRatePercent_WithUltraBall_ShouldBeHigherThanPokeball()
        {
            // Arrange
            var baseCtx = CreateContext(
                baseCaptureRate: 45,
                pokeballUsed: PokeballType.Pokeball
            );

            var ultraCtx = baseCtx with { PokeballUsed = PokeballType.UltraBall };

            // Act
            var pokeballRate = _calculator.GetCatchRatePercent(baseCtx);
            var ultraBallRate = _calculator.GetCatchRatePercent(ultraCtx);

            // Assert
            ultraBallRate.Should().BeGreaterThan(pokeballRate);
        }

        [Theory]
        [InlineData("sleep")]
        [InlineData("freeze")]
        public void GetCatchRatePercent_WithMajorStatus_ShouldBoostCatchRate(string condition)
        {
            // Arrange
            var normalCtx = CreateContext(
                baseCaptureRate: 50,
                statusCondition: null
            );

            var statusCtx = normalCtx with { StatusCondition = condition };

            // Act
            var normalRate = _calculator.GetCatchRatePercent(normalCtx);
            var statusRate = _calculator.GetCatchRatePercent(statusCtx);

            // Assert: Sleep/Freeze gives 2.5x multiplier
            statusRate.Should().BeApproximately(normalRate * 2.5, 0.01);
        }

        [Fact]
        public void GetCatchRatePercent_WithLegendary_ShouldBeLowerThanNormal()
        {
            // Arrange
            var normalCtx = CreateContext(
                baseCaptureRate: 45,
                isLegendary: false
            );

            var legendaryCtx = normalCtx with { IsLegendary = true };

            // Act
            var normalRate = _calculator.GetCatchRatePercent(normalCtx);
            var legendaryRate = _calculator.GetCatchRatePercent(legendaryCtx);

            // Assert: Legendary has a 0.6x multiplier
            legendaryRate.Should().BeLessThan(normalRate);
        }
    }
}
