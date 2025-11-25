using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PokemonController : ControllerBase
    {
        private readonly IPokemonService _pokemonService;

        public PokemonController(IPokemonService pokemonService)
        {
            _pokemonService = pokemonService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PokemonDto>>> GetAllPokemon()
        {
            var pokemon = await _pokemonService.GetAllPokemonAsync();
            return Ok(pokemon);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<PokemonDto>> GetPokemon(int id)
        {
            var pokemon = await _pokemonService.GetPokemonByIdAsync(id);
            if (pokemon == null)
            {
                return NotFound(new { message = "Pokemon not found" });
            }
            return Ok(pokemon);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<PokemonDto>>> SearchPokemon([FromQuery] string term)
        {
            if (string.IsNullOrWhiteSpace(term))
            {
                return BadRequest(new { message = "Search term is required" });
            }

            var pokemon = await _pokemonService.SearchPokemonAsync(term);
            return Ok(pokemon);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<PokemonDto>> CreatePokemon([FromBody] CreatePokemonDto createPokemonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pokemon = await _pokemonService.CreatePokemonAsync(createPokemonDto);
            return CreatedAtAction(nameof(GetPokemon), new { id = pokemon.Id }, pokemon);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<ActionResult> UpdatePokemon(int id, [FromBody] CreatePokemonDto updatePokemonDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _pokemonService.UpdatePokemonAsync(id, updatePokemonDto);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found" });
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<ActionResult> DeletePokemon(int id)
        {
            var result = await _pokemonService.DeletePokemonAsync(id);
            if (!result)
            {
                return NotFound(new { message = "Pokemon not found" });
            }

            return NoContent();
        }
    }
}
