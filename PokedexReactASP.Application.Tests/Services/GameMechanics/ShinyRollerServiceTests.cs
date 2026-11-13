using FluentAssertions;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Application.Services.GameMechanics;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services.GameMechanics
{
    public class ShinyRollerServiceTests
    {
        private readonly ShinyRollerService _roller;

        public ShinyRollerServiceTests()
        {
            _roller = new ShinyRollerService();
        }

        [Fact]
        public void GetShinyOdds_WithShinyCharm_ShouldHaveHigherOdds()
        {
            // Arrange
            var baseContext = new ShinyRollContext(
                TrainerLevel: 10,
                HasShinyCharm: false,
                CatchStreak: 0,
                TotalCaught: 50,
                IsEventPokemon: false
            );

            var charmContext = baseContext with { HasShinyCharm = true };

            // Act
            var baseOdds = _roller.GetShinyOdds(baseContext);
            var charmOdds = _roller.GetShinyOdds(charmContext);

            // Assert
            charmOdds.Should().BeGreaterThan(baseOdds);
        }

        [Fact]
        public void GetShinyOdds_HigherLevelTrainer_ShouldHaveHigherOdds()
        {
            // Arrange
            var lowLevelContext = new ShinyRollContext(
                TrainerLevel: 1,
                HasShinyCharm: false,
                CatchStreak: 0,
                TotalCaught: 0,
                IsEventPokemon: false
            );

            var highLevelContext = lowLevelContext with { TrainerLevel = 100 };

            // Act
            var lowLevelOdds = _roller.GetShinyOdds(lowLevelContext);
            var highLevelOdds = _roller.GetShinyOdds(highLevelContext);

            // Assert
            highLevelOdds.Should().BeGreaterThan(lowLevelOdds);
        }

        [Fact]
        public void RollShiny_ShouldNotThrowException()
        {
            // Arrange
            var context = new ShinyRollContext(
                TrainerLevel: 50,
                HasShinyCharm: true,
                CatchStreak: 10,
                TotalCaught: 100,
                IsEventPokemon: true
            );

            // Act
            var act = () => _roller.RollShiny(context);

            // Assert
            act.Should().NotThrow();
        }
    }
}
