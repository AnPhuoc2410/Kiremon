using AutoMapper;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Xunit;
using System;

namespace PokedexReactASP.Application.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<UserManager<ApplicationUser>> _mockUserManager;
        private readonly Mock<IPokemonCacheService> _mockPokemonCache;
        private readonly Mock<IPokemonEnricherService> _mockEnricher;
        private readonly Mock<IPokeApiService> _mockPokeApi;
        private readonly Mock<IPokemonFactoryService> _mockFactory;
        private readonly Mock<ICatchRateCalculatorService> _mockCatchRateCalc;
        private readonly Mock<IMapper> _mockMapper;
        private readonly UserService _service;

        public UserServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockUserManager = MockIdentityHelpers.MockUserManager<ApplicationUser>();
            _mockPokemonCache = new Mock<IPokemonCacheService>();
            _mockEnricher = new Mock<IPokemonEnricherService>();
            _mockPokeApi = new Mock<IPokeApiService>();
            _mockFactory = new Mock<IPokemonFactoryService>();
            _mockCatchRateCalc = new Mock<ICatchRateCalculatorService>();
            _mockMapper = new Mock<IMapper>();

            _service = new UserService(
                _mockUnitOfWork.Object,
                _mockUserManager.Object,
                _mockPokemonCache.Object,
                _mockEnricher.Object,
                _mockPokeApi.Object,
                _mockFactory.Object,
                _mockCatchRateCalc.Object,
                _mockMapper.Object
            );
        }

        [Fact]
        public async Task GetUserProfileAsync_ShouldReturnNull_WhenUserNotFound()
        {
            // Arrange
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _service.GetUserProfileAsync("1");

            // Assert
            result.Should().BeNull();
        }

        [Fact]
        public async Task GetUserProfileAsync_ShouldReturnDto_WhenUserExists()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", UserName = "test" };
            var dto = new UserProfileDto { Username = "test" };

            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            _mockMapper.Setup(m => m.Map<UserProfileDto>(user)).Returns(dto);

            // Act
            var result = await _service.GetUserProfileAsync("1");

            // Assert
            result.Should().NotBeNull();
            result.Username.Should().Be("test");
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldReturnFalse_WhenUserNotFound()
        {
            // Arrange
            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync((ApplicationUser)null);

            // Act
            var result = await _service.UpdateUserProfileAsync("1", new UpdateProfileDto());

            // Assert
            result.Should().BeFalse();
        }

        [Fact]
        public async Task UpdateUserProfileAsync_ShouldUpdateUser_WhenUserExists()
        {
            // Arrange
            var user = new ApplicationUser { Id = "1", FirstName = "Old", LastName = "Old", AvatarUrl = "old.png" };
            var updateDto = new UpdateProfileDto { FirstName = "New", LastName = "New", AvatarUrl = "new.png" };

            _mockUserManager.Setup(u => u.FindByIdAsync("1")).ReturnsAsync(user);
            _mockUserManager.Setup(u => u.UpdateAsync(user)).ReturnsAsync(IdentityResult.Success);

            // Act
            var result = await _service.UpdateUserProfileAsync("1", updateDto);

            // Assert
            result.Should().BeTrue();
            user.FirstName.Should().Be("New");
            user.LastName.Should().Be("New");
            user.AvatarUrl.Should().Be("new.png");
            _mockUserManager.Verify(u => u.UpdateAsync(user), Times.Once);
        }
    }
}
