using AutoMapper;
using FluentAssertions;
using Moq;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using System.Linq.Expressions;

namespace PokedexReactASP.Application.Tests.Services
{
    public class PokemonBoxServiceTests
    {
        private readonly Mock<IUnitOfWork> _mockUnitOfWork;
        private readonly Mock<IMapper> _mockMapper;
        private readonly Mock<IPokemonEnricherService> _mockEnricher;
        private readonly PokemonBoxService _service;

        public PokemonBoxServiceTests()
        {
            _mockUnitOfWork = new Mock<IUnitOfWork>();
            _mockMapper = new Mock<IMapper>();
            _mockEnricher = new Mock<IPokemonEnricherService>();

            _service = new PokemonBoxService(
                _mockUnitOfWork.Object,
                _mockMapper.Object,
                _mockEnricher.Object
            );
        }

        [Fact]
        public async Task GetBoxesAsync_ShouldCreateMissingBoxes_WhenLessThan32BoxesExist()
        {
            // Arrange
            var userId = "user1";
            var existingBoxes = new List<UserBox>
            {
                new UserBox { Id = 1, UserId = userId, Name = "Box 1", Order = 0, Pokemons = new List<UserPokemon>() }
            };

            _mockUnitOfWork.Setup(u => u.UserBox.FindAsync(
                It.IsAny<Expression<Func<UserBox, bool>>>(),
                It.IsAny<Func<IQueryable<UserBox>, IQueryable<UserBox>>>(),
                false))
                .ReturnsAsync(existingBoxes);

            _mockUnitOfWork.Setup(u => u.UserBox.AddAsync(It.IsAny<UserBox>()))
                           .Returns(Task.CompletedTask);

            _mockMapper.Setup(m => m.Map<List<UserBoxDto>>(It.IsAny<List<UserBox>>()))
                       .Returns(new List<UserBoxDto>());

            // Act
            var result = await _service.GetBoxesAsync(userId);

            // Assert
            _mockUnitOfWork.Verify(u => u.UserBox.AddAsync(It.IsAny<UserBox>()), Times.Exactly(31));
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task UpdateBoxAsync_ShouldThrowKeyNotFoundException_WhenBoxDoesNotExist()
        {
            // Arrange
            var userId = "user1";
            var boxId = 999;
            var updateDto = new UpdateBoxDto { Name = "New Name", BackgroundImage = "bg.png" };

            _mockUnitOfWork.Setup(u => u.UserBox.FirstOrDefaultAsync(
                It.IsAny<Expression<Func<UserBox, bool>>>(),
                It.IsAny<Func<IQueryable<UserBox>, IQueryable<UserBox>>>(),
                false))
                .ReturnsAsync((UserBox)null);

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateBoxAsync(userId, boxId, updateDto));
        }

        [Fact]
        public async Task UpdateBoxAsync_ShouldUpdateBox_WhenBoxExists()
        {
            // Arrange
            var userId = "user1";
            var boxId = 1;
            var updateDto = new UpdateBoxDto { Name = "Updated Box", BackgroundImage = "updated_bg.png" };
            
            var existingBox = new UserBox 
            { 
                Id = boxId, 
                UserId = userId, 
                Name = "Old Box", 
                BackgroundImage = "old_bg.png",
                Pokemons = new List<UserPokemon>()
            };

            var mappedDto = new UserBoxDto { Id = boxId, Name = "Updated Box", BackgroundImage = "updated_bg.png", Pokemons = new List<UserPokemonDto>() };

            _mockUnitOfWork.Setup(u => u.UserBox.FirstOrDefaultAsync(
                It.IsAny<Expression<Func<UserBox, bool>>>(),
                It.IsAny<Func<IQueryable<UserBox>, IQueryable<UserBox>>>(),
                false))
                .ReturnsAsync(existingBox);

            _mockMapper.Setup(m => m.Map<UserBoxDto>(existingBox))
                       .Returns(mappedDto);

            // Act
            var result = await _service.UpdateBoxAsync(userId, boxId, updateDto);

            // Assert
            existingBox.Name.Should().Be("Updated Box");
            existingBox.BackgroundImage.Should().Be("updated_bg.png");
            
            _mockUnitOfWork.Verify(u => u.UserBox.Update(existingBox), Times.Once);
            _mockUnitOfWork.Verify(u => u.SaveChangesAsync(), Times.Once);
            
            result.Should().BeEquivalentTo(mappedDto);
        }
    }
}
