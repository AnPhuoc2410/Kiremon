using FluentAssertions;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Application.Services.GameMechanics;
using PokedexReactASP.Domain.Enums;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services.GameMechanics
{
    public class NatureGeneratorServiceTests
    {
        private readonly NatureGeneratorService _service;

        public NatureGeneratorServiceTests()
        {
            _service = new NatureGeneratorService();
        }

        [Fact]
        public void GenerateNature_WithoutContext_ShouldReturnValidNature()
        {
            // Act
            var nature = _service.GenerateNature();

            // Assert
            Enum.IsDefined(typeof(Nature), nature).Should().BeTrue();
        }

        [Fact]
        public void GetModifiers_Adamant_ShouldBoostAttackAndDecreaseSpAttack()
        {
            // Act
            var mods = _service.GetModifiers(Nature.Adamant);

            // Assert
            mods.IncreasedStat.Should().Be("Attack");
            mods.DecreasedStat.Should().Be("Sp. Attack");
            mods.AttackMod.Should().Be(1.1);
            mods.SpAttackMod.Should().Be(0.9);
            mods.DefenseMod.Should().Be(1.0);
            mods.SpeedMod.Should().Be(1.0);
        }

        [Fact]
        public void GetModifiers_Hardy_ShouldBeNeutral()
        {
            // Act
            var mods = _service.GetModifiers(Nature.Hardy);

            // Assert
            mods.IncreasedStat.Should().BeNull();
            mods.DecreasedStat.Should().BeNull();
            mods.AttackMod.Should().Be(1.0);
            mods.DefenseMod.Should().Be(1.0);
            mods.SpeedMod.Should().Be(1.0);
        }

        [Fact]
        public void GetDisplayName_ShouldReturnExpectedDescription()
        {
            // Act & Assert
            _service.GetDisplayName(Nature.Hardy).Should().Be("Hardy (Neutral)");
            _service.GetDisplayName(Nature.Jolly).Should().Contain("+Speed, -Sp. Attack");
        }
    }
}

