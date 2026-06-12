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
                query => query.Include(b => b.Pokemons),
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

            var boxDtos = boxes.Select(b => new UserBoxDto
            {
                Id = b.Id,
                Name = b.Name,
                Order = b.Order,
                BackgroundImage = b.BackgroundImage,
                PokemonCount = b.Pokemons.Count,
                Pokemons = new List<UserPokemonDto>()
            }).ToList();

            return boxDtos;
        }

        public async Task<UserBoxDto> GetBoxDetailsAsync(string userId, int boxId, CancellationToken cancellationToken = default)
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

            var boxDto = _mapper.Map<UserBoxDto>(box);
            boxDto.PokemonCount = box.Pokemons.Count;

            if (box.Pokemons.Any())
            {
                var enrichedPokemons = await _pokemonEnricher.EnrichBatchAsync(box.Pokemons);
                boxDto.Pokemons = enrichedPokemons.OrderBy(p => p.SlotIndex).ToList();
            }

            return boxDto;
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

        public async Task<MovePokemonResultDto> MovePokemonAsync(string userId, int userPokemonId, MovePokemonDto dto, CancellationToken cancellationToken = default)
        {
            // Input validation
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

            // Batch fetch the moving pokemon and any target pokemon in the destination slot in a single query
            var pokemonList = (await _unitOfWork.UserPokemon.FindAsync(
                p => p.UserId == userId && (p.Id == userPokemonId || 
                    (dto.ToParty 
                        ? (p.IsInParty && p.SlotIndex == dto.SlotIndex)
                        : (p.BoxId == dto.TargetBoxId && p.SlotIndex == dto.SlotIndex && !p.IsInParty)
                    )
                ),
                disableTracking: false
            )).ToList();

            var pokemon = pokemonList.FirstOrDefault(p => p.Id == userPokemonId);
            if (pokemon == null)
            {
                return new MovePokemonResultDto { Success = false, Message = "Pokémon not found." };
            }

            int? sourceBoxId = pokemon.BoxId;
            var targetPokemon = pokemonList.FirstOrDefault(p => p.Id != userPokemonId);
            int? swappedPokemonId = null;

            if (dto.ToParty)
            {
                if (targetPokemon != null)
                {
                    swappedPokemonId = targetPokemon.Id;

                    // Swap
                    targetPokemon.IsInParty = pokemon.IsInParty;
                    targetPokemon.BoxId = pokemon.BoxId;
                    targetPokemon.SlotIndex = pokemon.SlotIndex;

                    pokemon.IsInParty = true;
                    pokemon.BoxId = null;
                    pokemon.SlotIndex = dto.SlotIndex;

                    _unitOfWork.UserPokemon.Update(targetPokemon);
                }
                else
                {
                    pokemon.IsInParty = true;
                    pokemon.BoxId = null;
                    pokemon.SlotIndex = dto.SlotIndex;
                }
            }
            else
            {
                if (targetPokemon != null)
                {
                    swappedPokemonId = targetPokemon.Id;

                    // Swap
                    targetPokemon.IsInParty = pokemon.IsInParty;
                    targetPokemon.BoxId = pokemon.BoxId;
                    targetPokemon.SlotIndex = pokemon.SlotIndex;

                    pokemon.IsInParty = false;
                    pokemon.BoxId = dto.TargetBoxId;
                    pokemon.SlotIndex = dto.SlotIndex;

                    _unitOfWork.UserPokemon.Update(targetPokemon);
                }
                else
                {
                    // Straight move to Box: check if leaving Party empty (only query db count if moving from party)
                    if (pokemon.IsInParty)
                    {
                        int partyCount = await _unitOfWork.UserPokemon.CountAsync(p => p.UserId == userId && p.IsInParty);
                        if (partyCount <= 1)
                        {
                            return new MovePokemonResultDto { Success = false, Message = "You must keep at least 1 Pokémon in your party." };
                        }
                    }

                    pokemon.IsInParty = false;
                    pokemon.BoxId = dto.TargetBoxId;
                    pokemon.SlotIndex = dto.SlotIndex;
                }
            }

            _unitOfWork.UserPokemon.Update(pokemon);
            await _unitOfWork.SaveChangesAsync();

            return new MovePokemonResultDto
            {
                Success = true,
                SwappedPokemonId = swappedPokemonId,
                SourceBoxId = sourceBoxId,
                TargetBoxId = dto.ToParty ? null : dto.TargetBoxId
            };
        }

        public async Task<BatchMoveResultDto> MovePokemonBatchAsync(string userId, BatchMovePokemonDto dto, CancellationToken cancellationToken = default)
        {
            var pokemonIds = dto.Moves.Select(m => m.UserPokemonId).ToList();
            var movingIds = pokemonIds.ToHashSet();

            var pokemons = (await _unitOfWork.UserPokemon.FindAsync(
                p => p.UserId == userId && pokemonIds.Contains(p.Id),
                disableTracking: false
            )).ToDictionary(p => p.Id);

            if (pokemons.Count != dto.Moves.Count)
            {
                return new BatchMoveResultDto { Success = false };
            }

            // Gather affected Box IDs and Party affected status
            var affectedBoxIds = new HashSet<int>();
            bool partyAffected = false;

            foreach (var p in pokemons.Values)
            {
                if (p.BoxId.HasValue) affectedBoxIds.Add(p.BoxId.Value);
                if (p.IsInParty) partyAffected = true;
            }

            foreach (var move in dto.Moves)
            {
                if (move.TargetBoxId.HasValue) affectedBoxIds.Add(move.TargetBoxId.Value);
                if (move.ToParty) partyAffected = true;
            }

            // Party size check
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

            if (currentPartyCount - leavingPartyCount + enteringPartyCount < 1)
            {
                return new BatchMoveResultDto { Success = false }; // Rule: at least 1 pokemon in party
            }

            // Occupancy check - destination must not be occupied by non-moving pokemon
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
                        return new BatchMoveResultDto { Success = false }; // Target slot is occupied by another pokemon outside the tray
                    }
                }
            }

            // Execute moves
            foreach (var move in dto.Moves)
            {
                var p = pokemons[move.UserPokemonId];
                p.IsInParty = move.ToParty;
                p.BoxId = move.ToParty ? null : move.TargetBoxId;
                p.SlotIndex = move.SlotIndex;
                _unitOfWork.UserPokemon.Update(p);
            }

            await _unitOfWork.SaveChangesAsync();
            return new BatchMoveResultDto
            {
                Success = true,
                AffectedBoxIds = affectedBoxIds.ToList(),
                PartyAffected = partyAffected
            };
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
