using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;
using System.Linq;
using System.Threading.Tasks;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly PokemonDbContext _context;

        public AdminController(PokemonDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalUsers = await _context.Users.CountAsync();
            var totalPokemonCaught = await _context.UserPokemon.CountAsync();
            var totalBoxes = await _context.UserBoxes.CountAsync();

            var users = await _context.Users
                .Select(u => new
                {
                    Id = u.Id,
                    Username = u.UserName,
                    Email = u.Email,
                    Level = u.TrainerLevel,
                    Coins = u.Coins,
                    Experience = u.TotalExperience,
                    PokemonCaught = u.PokemonCaught,
                    EmailConfirmed = u.EmailConfirmed,
                    LastActiveDate = u.LastActiveDate
                })
                .ToListAsync();

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalPokemonCaught = totalPokemonCaught,
                TotalBoxes = totalBoxes,
                Users = users
            });
        }
    }
}
