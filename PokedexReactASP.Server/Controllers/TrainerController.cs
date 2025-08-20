using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TrainerController : ControllerBase
    {
        private readonly PokemonDbContext _context;

        public TrainerController(PokemonDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Trainer>>> GetTrainers()
        {
            return await _context.Trainers
                .Include(t => t.UserPokemons)
                .ThenInclude(up => up.Pokemon)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Trainer>> GetTrainer(int id)
        {
            var trainer = await _context.Trainers
                .Include(t => t.UserPokemons)
                .ThenInclude(up => up.Pokemon)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (trainer == null)
            {
                return NotFound();
            }

            return trainer;
        }

        [HttpPost]
        public async Task<ActionResult<Trainer>> PostTrainer(Trainer trainer)
        {
            trainer.DateJoined = DateTime.UtcNow;
            _context.Trainers.Add(trainer);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrainer", new { id = trainer.Id }, trainer);
        }

        [HttpPost("{trainerId}/catch/{pokemonId}")]
        public async Task<ActionResult> CatchPokemon(int trainerId, int pokemonId)
        {
            var trainer = await _context.Trainers.FindAsync(trainerId);
            var pokemon = await _context.Pokemon.FindAsync(pokemonId);

            if (trainer == null || pokemon == null)
            {
                return NotFound();
            }

            // Check if trainer already has this pokemon
            var existingUserPokemon = await _context.UserPokemon
                .FirstOrDefaultAsync(up => up.TrainerId == trainerId && up.PokemonId == pokemonId);

            if (existingUserPokemon != null)
            {
                return BadRequest("Trainer already has this Pokemon");
            }

            var userPokemon = new UserPokemon
            {
                TrainerId = trainerId,
                PokemonId = pokemonId,
                CaughtDate = DateTime.UtcNow
            };

            _context.UserPokemon.Add(userPokemon);
            await _context.SaveChangesAsync();

            return Ok("Pokemon caught successfully!");
        }

        [HttpGet("{trainerId}/pokemon")]
        public async Task<ActionResult<IEnumerable<Pokemon>>> GetTrainerPokemon(int trainerId)
        {
            var pokemon = await _context.UserPokemon
                .Where(up => up.TrainerId == trainerId)
                .Include(up => up.Pokemon)
                .Select(up => up.Pokemon)
                .ToListAsync();

            return pokemon;
        }
    }
}