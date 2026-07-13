using AutoMapper;
using Microsoft.EntityFrameworkCore;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public class PokemonBoxService : IPokemonBoxService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPokemonEnricherService _pokemonEnricher;

        public PokemonBoxService(
            IUnitOfWork unitOfWork,
            IMapper mapper,
            IPokemonEnricherService pokemonEnricher)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _pokemonEnricher = pokemonEnricher;
        }

        public async Task<IEnumerable<UserBoxDto>> GetBoxesAsync(string userId, CancellationToken cancellationToken = default)
        {
            var boxes = (await _unitOfWork.UserBox.FindAsync(
                b => b.UserId == userId,
                query => query.Include(b => b.Pokemons).ThenInclude(p => p.HeldItem),
                disableTracking: false
            )).OrderBy(b => b.Order).ToList();

            if (boxes.Count < 32)
            {
                int currentCount = boxes.Count;
                for (int i = currentCount; i < 32; i++)
                {
                    var newBox = new UserBox
                    {
                        UserId = userId,
                        Name = $"Box {i + 1}",
                        Order = i,
                        BackgroundImage = "Box_Forest_BDSP.png"
                    };
                    await _unitOfWork.UserBox.AddAsync(newBox);
                    boxes.Add(newBox);
                }
                await _unitOfWork.SaveChangesAsync();
            }

            var boxDtos = _mapper.Map<List<UserBoxDto>>(boxes);

            // Enrich all box pokemons in batch
            var allBoxPokemons = boxes.SelectMany(b => b.Pokemons).ToList();
            if (allBoxPokemons.Any())
            {
                var enrichedPokemons = await _pokemonEnricher.EnrichBatchAsync(allBoxPokemons);
                var enrichedDict = enrichedPokemons.ToDictionary(p => p.Id);

                foreach (var boxDto in boxDtos)
                {
                    boxDto.Pokemons = boxDto.Pokemons.Select(p =>
                        enrichedDict.TryGetValue(p.Id, out var enriched) ? enriched : p
                    ).OrderBy(p => p.SlotIndex).ToList();
                }
            }

            return boxDtos;
        }

        public async Task<UserBoxDto> UpdateBoxAsync(string userId, int boxId, UpdateBoxDto dto, CancellationToken cancellationToken = default)
        {
            var box = await _unitOfWork.UserBox.FirstOrDefaultAsync(
                b => b.UserId == userId && b.Id == boxId,
                query => query.Include(b => b.Pokemons).ThenInclude(p => p.HeldItem),
                disableTracking: false
            );

            if (box == null)
            {
                throw new KeyNotFoundException("Box not found.");
            }

            box.Name = dto.Name;
            box.BackgroundImage = dto.BackgroundImage;

            _unitOfWork.UserBox.Update(box);
            await _unitOfWork.SaveChangesAsync();

            var boxDto = _mapper.Map<UserBoxDto>(box);

            if (box.Pokemons.Any())
            {
                var enrichedPokemons = await _pokemonEnricher.EnrichBatchAsync(box.Pokemons);
                boxDto.Pokemons = enrichedPokemons.OrderBy(p => p.SlotIndex).ToList();
            }

            return boxDto;
        }

        /// <summary>
        /// Moves a Pokémon to a new slot in the party or a box, swapping with an existing Pokémon if the target slot is occupied.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="userPokemonId">The ID of the Pokémon to move.</param>
        /// <param name="dto">The destination details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>The result of the move operation.</returns>
        public async Task<MovePokemonResultDto> MovePokemonAsync(string userId, int userPokemonId, MovePokemonDto dto, CancellationToken cancellationToken = default)
        {
            var validationResult = ValidateMoveRequest(dto);
            if (validationResult != null)
            {
                return validationResult;
            }

            var (pokemon, targetPokemon) = await FetchPokemonsForMoveAsync(userId, userPokemonId, dto);

            if (pokemon == null)
            {
                return new MovePokemonResultDto { Success = false, Message = "Pokémon not found." };
            }

            var constraintResult = await ValidatePartyConstraintAsync(userId, pokemon, targetPokemon, dto);
            if (constraintResult != null)
            {
                return constraintResult;
            }

            int? swappedPokemonId = ExecutePokemonMove(pokemon, targetPokemon, dto);

            _unitOfWork.UserPokemon.Update(pokemon);
            if (targetPokemon != null)
            {
                _unitOfWork.UserPokemon.Update(targetPokemon);
            }
            
            await _unitOfWork.SaveChangesAsync();

            return new MovePokemonResultDto
            {
                Success = true,
                SwappedPokemonId = swappedPokemonId
            };
        }

        /// <summary>
        /// Validates the destination parameters of the move request.
        /// </summary>
        private MovePokemonResultDto? ValidateMoveRequest(MovePokemonDto dto)
        {
            if (dto.ToParty)
            {
                if (dto.SlotIndex < 0 || dto.SlotIndex > 5)
                {
                    return new MovePokemonResultDto { Success = false, Message = "Invalid party slot index. Must be between 0 and 5." };
                }
            }
            else
            {
                if (dto.TargetBoxId == null)
                {
                    return new MovePokemonResultDto { Success = false, Message = "Target Box ID is required." };
                }
                if (dto.SlotIndex < 0 || dto.SlotIndex > 29)
                {
                    return new MovePokemonResultDto { Success = false, Message = "Invalid box slot index. Must be between 0 and 29." };
                }
            }

            return null;
        }

        /// <summary>
        /// Fetches the moving Pokémon and the target Pokémon occupying the destination slot, if any.
        /// </summary>
        private async Task<(UserPokemon? pokemon, UserPokemon? targetPokemon)> FetchPokemonsForMoveAsync(string userId, int userPokemonId, MovePokemonDto dto)
        {
            var pokemonList = await _unitOfWork.UserPokemon.FindAsync(
                p => p.UserId == userId && (p.Id == userPokemonId || 
                    (dto.ToParty 
                        ? (p.IsInParty && p.SlotIndex == dto.SlotIndex)
                        : (p.BoxId == dto.TargetBoxId && p.SlotIndex == dto.SlotIndex && !p.IsInParty)
                    )
                ),
                disableTracking: false
            );

            var pokemon = pokemonList.FirstOrDefault(p => p.Id == userPokemonId);
            var targetPokemon = pokemonList.FirstOrDefault(p => p.Id != userPokemonId);

            return (pokemon, targetPokemon);
        }

        /// <summary>
        /// Validates that moving the Pokémon will not leave the user's party empty.
        /// </summary>
        private async Task<MovePokemonResultDto?> ValidatePartyConstraintAsync(string userId, UserPokemon pokemon, UserPokemon? targetPokemon, MovePokemonDto dto)
        {
            // If the pokemon is leaving the party, and there is no target pokemon replacing it in the party
            if (pokemon.IsInParty && !dto.ToParty && targetPokemon == null)
            {
                int partyCount = await _unitOfWork.UserPokemon.CountAsync(p => p.UserId == userId && p.IsInParty);
                if (partyCount <= 1)
                {
                    return new MovePokemonResultDto { Success = false, Message = "You must keep at least 1 Pokémon in your party." };
                }
            }

            return null;
        }

        /// <summary>
        /// Executes the state swap between the moving Pokémon and the target slot, updating entity properties in-memory.
        /// </summary>
        private int? ExecutePokemonMove(UserPokemon pokemon, UserPokemon? targetPokemon, MovePokemonDto dto)
        {
            int? swappedPokemonId = null;

            if (targetPokemon != null)
            {
                swappedPokemonId = targetPokemon.Id;

                // The target takes the source pokemon's original spot
                targetPokemon.IsInParty = pokemon.IsInParty;
                targetPokemon.BoxId = pokemon.BoxId;
                targetPokemon.SlotIndex = pokemon.SlotIndex;
            }

            // The source pokemon moves to the destination
            pokemon.IsInParty = dto.ToParty;
            pokemon.BoxId = dto.ToParty ? null : dto.TargetBoxId;
            pokemon.SlotIndex = dto.SlotIndex;

            return swappedPokemonId;
        }

        /// <summary>
        /// Moves a batch of Pokémon simultaneously, enforcing party constraints and avoiding collisions.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="dto">The batch move details.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        /// <returns>True if the batch move succeeded, otherwise false.</returns>
        public async Task<bool> MovePokemonBatchAsync(string userId, BatchMovePokemonDto dto, CancellationToken cancellationToken = default)
        {
            var pokemons = await FetchPokemonsForBatchMoveAsync(userId, dto);
            if (pokemons == null)
            {
                return false;
            }

            if (!await ValidateBatchPartyConstraintAsync(userId, pokemons, dto))
            {
                return false;
            }

            var movingIds = dto.Moves.Select(m => m.UserPokemonId).ToHashSet();
            if (!await ValidateBatchOccupancyAsync(userId, movingIds, dto))
            {
                return false;
            }

            ExecuteBatchPokemonMoves(pokemons, dto);
            
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Fetches the Pokémon to be moved and ensures all requested Pokémon exist and belong to the user.
        /// </summary>
        private async Task<Dictionary<int, UserPokemon>?> FetchPokemonsForBatchMoveAsync(string userId, BatchMovePokemonDto dto)
        {
            var pokemonIds = dto.Moves.Select(m => m.UserPokemonId).ToList();

            var pokemons = (await _unitOfWork.UserPokemon.FindAsync(
                p => p.UserId == userId && pokemonIds.Contains(p.Id),
                disableTracking: false
            )).ToDictionary(p => p.Id);

            if (pokemons.Count != dto.Moves.Count)
            {
                return null;
            }

            return pokemons;
        }

        /// <summary>
        /// Validates that the batch move does not leave the user's party completely empty.
        /// </summary>
        private async Task<bool> ValidateBatchPartyConstraintAsync(string userId, Dictionary<int, UserPokemon> pokemons, BatchMovePokemonDto dto)
        {
            int currentPartyCount = await _unitOfWork.UserPokemon.CountAsync(p => p.UserId == userId && p.IsInParty);
            int leavingPartyCount = 0;
            int enteringPartyCount = 0;

            foreach (var move in dto.Moves)
            {
                var p = pokemons[move.UserPokemonId];
                if (p.IsInParty && !move.ToParty)
                {
                    leavingPartyCount++;
                }
                else if (!p.IsInParty && move.ToParty)
                {
                    enteringPartyCount++;
                }
            }

            return (currentPartyCount - leavingPartyCount + enteringPartyCount) >= 1;
        }

        /// <summary>
        /// Validates that destination slots are not occupied by Pokémon outside of the current batch move.
        /// </summary>
        private async Task<bool> ValidateBatchOccupancyAsync(string userId, HashSet<int> movingIds, BatchMovePokemonDto dto)
        {
            var targetBoxIds = dto.Moves.Where(m => !m.ToParty && m.TargetBoxId.HasValue)
                                         .Select(m => m.TargetBoxId!.Value)
                                         .Distinct()
                                         .ToList();

            var existingInTargets = await _unitOfWork.UserPokemon.FindAsync(
                p => p.UserId == userId && (p.IsInParty || (p.BoxId.HasValue && targetBoxIds.Contains(p.BoxId.Value))),
                disableTracking: true
            );

            var occupyingMap = existingInTargets.ToDictionary(
                p => p.IsInParty ? $"party_{p.SlotIndex}" : $"box_{p.BoxId}_{p.SlotIndex}",
                p => p.Id
            );

            foreach (var move in dto.Moves)
            {
                string targetKey = move.ToParty
                    ? $"party_{move.SlotIndex}"
                    : $"box_{move.TargetBoxId}_{move.SlotIndex}";

                if (occupyingMap.TryGetValue(targetKey, out int occupyingId))
                {
                    if (!movingIds.Contains(occupyingId))
                    {
                        return false; // Target slot is occupied by another pokemon outside the tray
                    }
                }
            }

            return true;
        }

        /// <summary>
        /// Applies the move updates to the tracked Pokémon entities.
        /// </summary>
        private void ExecuteBatchPokemonMoves(Dictionary<int, UserPokemon> pokemons, BatchMovePokemonDto dto)
        {
            foreach (var move in dto.Moves)
            {
                var p = pokemons[move.UserPokemonId];
                p.IsInParty = move.ToParty;
                p.BoxId = move.ToParty ? null : move.TargetBoxId;
                p.SlotIndex = move.SlotIndex;
                _unitOfWork.UserPokemon.Update(p);
            }
        }

        public async Task<bool> ReorderBoxesAsync(string userId, ReorderBoxesDto dto, CancellationToken cancellationToken = default)
        {
            var boxA = await _unitOfWork.UserBox.FirstOrDefaultAsync(b => b.UserId == userId && b.Id == dto.BoxIdA);
            var boxB = await _unitOfWork.UserBox.FirstOrDefaultAsync(b => b.UserId == userId && b.Id == dto.BoxIdB);

            if (boxA == null || boxB == null)
            {
                return false;
            }

            int tempOrder = boxA.Order;
            boxA.Order = boxB.Order;
            boxB.Order = tempOrder;

            _unitOfWork.UserBox.Update(boxA);
            _unitOfWork.UserBox.Update(boxB);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }
    }
}
