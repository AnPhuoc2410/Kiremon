using FluentAssertions;
using Moq;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Application.Services.GameMechanics;
using PokedexReactASP.Domain.Enums;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services.GameMechanics
{
    public class PokemonFactoryServiceTests
    {
        private readonly Mock<IIVGeneratorService> _mockIvGenerator;
        private readonly Mock<IShinyRollerService> _mockShinyRoller;
        private readonly Mock<INatureGeneratorService> _mockNatureGenerator;
        private readonly PokemonFactoryService _factory;

        public PokemonFactoryServiceTests()
        {
            _mockIvGenerator = new Mock<IIVGeneratorService>();
            _mockShinyRoller = new Mock<IShinyRollerService>();
            _mockNatureGenerator = new Mock<INatureGeneratorService>();

            _mockIvGenerator.Setup(g => g.GenerateIVs(It.IsAny<IVGenerationContext>()))
                .Returns(new IVSet(31, 31, 31, 31, 31, 31));
            _mockIvGenerator.Setup(g => g.CalculateRank(It.IsAny<IVSet>(), It.IsAny<Nature>()))
                .Returns(PokemonRank.SS);

            _mockShinyRoller.Setup(s => s.RollShiny(It.IsAny<ShinyRollContext>()))
                .Returns(false);

            _mockNatureGenerator.Setup(n => n.GenerateNature(It.IsAny<NatureGenerationContext?>()))
                .Returns(Nature.Adamant);

            _factory = new PokemonFactoryService(
                _mockIvGenerator.Object,
                _mockShinyRoller.Object,
                _mockNatureGenerator.Object);
        }

        private static PokemonCreationContext CreateContext(
            string userId = "user1",
            int pokemonApiId = 25,
            string pokemonName = "pikachu",
            string? nickname = null,
            int trainerLevel = 20,
            bool isBaby = false)
        {
            return new PokemonCreationContext(
                UserId: userId,
                PokemonApiId: pokemonApiId,
                PokemonName: pokemonName,
                Nickname: nickname,
                CaughtLocation: "Viridian Forest",
                CaughtBall: PokeballType.Pokeball,
                TrainerLevel: trainerLevel,
                TotalPokemonCaught: 10,
                CatchStreak: 0,
                HasShinyCharm: false,
                IsLegendary: false,
                IsMythical: false,
                IsBaby: isBaby,
                BaseCaptureRate: 45,
                BaseExperience: 112,
                Type1: "electric",
                Type2: null,
                SpriteUrl: "pikachu.png",
                ShinySpriteUrl: "pikachu_shiny.png",
                GenderRate: 4, // 50% male/female
                Abilities: new List<PokeApiAbility>
                {
                    new() { Ability = new() { Name = "static" }, Is_Hidden = false, Slot = 1 }
                }
            );
        }

        [Fact]
        public async Task CreateCaughtPokemonAsync_ShouldInstantiateUserPokemonWithValidStats()
        {
            // Arrange
            var context = CreateContext(nickname: "Sparky");

            // Act
            var result = await _factory.CreateCaughtPokemonAsync(context);

            // Assert
            result.Should().NotBeNull();
            result.Pokemon.UserId.Should().Be("user1");
            result.Pokemon.PokemonApiId.Should().Be(25);
            result.Pokemon.Nickname.Should().Be("Sparky");
            result.Pokemon.Nature.Should().Be(Nature.Adamant);
            result.Pokemon.IvHp.Should().Be(31);
            result.Pokemon.Ability.Should().Be("static");
            result.DisplayDto.DisplayName.Should().Be("Sparky");
            result.DisplayDto.Rank.Should().Be(PokemonRank.SS);
        }

        [Fact]
        public async Task CreateCaughtPokemonAsync_WithBabyPokemon_ShouldHaveHigherInitialFriendship()
        {
            // Arrange
            var normalContext = CreateContext(isBaby: false);
            var babyContext = CreateContext(isBaby: true);

            // Act
            var normalResult = await _factory.CreateCaughtPokemonAsync(normalContext);
            var babyResult = await _factory.CreateCaughtPokemonAsync(babyContext);

            // Assert
            babyResult.Pokemon.Friendship.Should().Be(140);
            normalResult.Pokemon.Friendship.Should().Be(70);
        }
    }
}
