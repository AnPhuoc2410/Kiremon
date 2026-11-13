using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Identity;
using Moq;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.Mappings;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using Xunit;

namespace PokedexReactASP.Application.Tests.Services
{
    public class UserProfileServiceTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IMapper> _mockMapper;
        private readonly UserProfileService _service;

        public UserProfileServiceTests()
        {
            _mockUserManager = MockIdentityHelpers.MockUserManager<ApplicationUser>();
            _mockMapper = new Mock<IMapper>();
            _service = new UserProfileService(_mockUserManager.Object, _mockMapper.Object);
        }

        [Fact]
        public async Task GetUserProfileAsync_ShouldReturnNull_WhenUserNotFound()
        {
            // Arrange
            _mockUserManager.Setup(u => u.FindByIdAsync("nonexistent"))
                .ReturnsAsync((ApplicationUser?)null);

            // Act
            var result = await _service.GetUserProfileAsync("nonexistent");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetUserProfileAsync_ShouldReturnProfile_WhenUserExists()
        {
            // Arrange
            var user = new ApplicationUser
            {
                Id = "user123",
                UserName = "AshKetchum",
                Email = "ash@pallet.town",
                TrainerLevel = 10,
                TotalExperience = 15000,
                PokemonCaught = 25,
                Coins = 500
            };

            _mockUserManager.Setup(u => u.FindByIdAsync("user123"))
                .ReturnsAsync(user);

            var profileDto = new UserProfileDto
            {
                UserId = "user123",
                Username = "AshKetchum",
                Level = 10,
                Experience = 15000,
                PokemonCaught = 25,
                Coins = 500
            };
            _mockMapper.Setup(m => m.Map<UserProfileDto>(user))
                .Returns(profileDto);

            // Act
            var result = await _service.GetUserProfileAsync("user123");

            // Assert
            result.Should().NotBeNull();
            result!.UserId.Should().Be("user123");
            result.Username.Should().Be("AshKetchum");
            result.Level.Should().Be(10);
            result.Experience.Should().Be(15000);
            result.PokemonCaught.Should().Be(25);
            result.Coins.Should().Be(500);
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnFalse_WhenUserNotFound()
        {
            // Arrange
            _mockUserManager.Setup(u => u.FindByIdAsync("missing_user"))
                .ReturnsAsync((ApplicationUser?)null);

            var updateDto = new UpdateProfileDto
            {
                FirstName = "Red",
                LastName = "Kanto"
            };

            // Act
            var result = await _service.UpdateUserProfileAsync("missing_user", updateDto);

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldUpdateFieldsAndReturnTrue_WhenSuccessful()
        {
            // Arrange
            var user = new ApplicationUser
            {
                Id = "user1",
                FirstName = "OldFirst",
                LastName = "OldLast",
                AvatarUrl = "old_avatar.png"
            };

            _mockUserManager.Setup(u => u.FindByIdAsync("user1"))
                .ReturnsAsync(user);
            _mockUserManager.Setup(u => u.UpdateAsync(user))
                .ReturnsAsync(IdentityResult.Success);

            var updateDto = new UpdateProfileDto
            {
                FirstName = "NewFirst",
                LastName = "NewLast",
                AvatarUrl = "new_avatar.png"
            };

            // Act
            var result = await _service.UpdateUserProfileAsync("user1", updateDto);

            // Assert
            result.Should().BeTrue();
            user.FirstName.Should().Be("NewFirst");
            user.LastName.Should().Be("NewLast");
            user.AvatarUrl.Should().Be("new_avatar.png");
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldKeepExistingValues_WhenDtoFieldsAreNull()
        {
            // Arrange
            var user = new ApplicationUser
            {
                Id = "user1",
                FirstName = "KeepFirst",
                LastName = "KeepLast",
                AvatarUrl = "keep_avatar.png"
            };

            _mockUserManager.Setup(u => u.FindByIdAsync("user1"))
                .ReturnsAsync(user);
            _mockUserManager.Setup(u => u.UpdateAsync(user))
                .ReturnsAsync(IdentityResult.Success);

            var updateDto = new UpdateProfileDto
            {
                FirstName = null,
                LastName = null,
                AvatarUrl = null
            };

            // Act
            var result = await _service.UpdateUserProfileAsync("user1", updateDto);

            // Assert
            result.Should().BeTrue();
            user.FirstName.Should().Be("KeepFirst");
            user.LastName.Should().Be("KeepLast");
            user.AvatarUrl.Should().Be("keep_avatar.png");
        }
    }
}
