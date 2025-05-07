import { ApiService } from '../api/api-client';
import { cacheUtils } from '../cache/cache';
import { buildEndpointUrl } from '../../config/api.config';
import { IGeneration, IGenerationDetail, INameUrlPair } from '../../types/pokemon';

class GenerationsService extends ApiService {
  constructor() {
    super(buildEndpointUrl('generations'));
  }

  /**
   * Fetch all available generations
   */
  async getAllGenerations(): Promise<INameUrlPair[]> {
    const cacheKey = 'generations:all';
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const response = await this.get<{ results: INameUrlPair[] }>('');
        return response.results || [];
      }, ONE_DAY);
    } catch (error) {
      console.error("Error fetching generations:", error);
      return [];
    }
  }

  /**
   * Fetch detailed information about a specific generation
   */
  async getGenerationDetails(idOrName: string | number): Promise<IGeneration | null> {
    if (!idOrName) return null;
    const cacheKey = `generations:detail:${idOrName}`;
    const TWELVE_HOURS = 12 * 60 * 60 * 1000; // 12 hours cache

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        return await this.get<IGeneration>(`/${idOrName}`);
      }, TWELVE_HOURS);
    } catch (error) {
      console.error(`Error fetching details for generation ${idOrName}:`, error);
      return null;
    }
  }

  /**
   * Fetch generation with enhanced details including moves, pokemon species, and version groups
   */
  async getGenerationWithDetails(idOrName: string | number): Promise<IGenerationDetail | null> {
    if (!idOrName) return null;
    const cacheKey = `generations:enhanced:${idOrName}`;
    const SIX_HOURS = 6 * 60 * 60 * 1000; // 6 hours cache

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const generation = await this.getGenerationDetails(idOrName);

        if (!generation) return null;

        // Get additional details for Pokémon species
        const pokemonSpecies = await Promise.all(
          generation.pokemon_species.map(async (species) => {
            try {
              // Extract ID from URL for sprite building
              const id = parseInt(species.url.split('/').filter(Boolean).pop() || '0');
              return {
                ...species,
                id,
                sprite: id > 0
                  ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
                  : null
              };
            } catch (e) {
              console.error(`Error processing species ${species.name}:`, e);
              return species;
            }
          })
        );

        // Get additional details for moves
        const movesWithDetails = await Promise.all(
          generation.moves.map(async (move) => {
            try {
              // Extract ID from URL
              const id = parseInt(move.url.split('/').filter(Boolean).pop() || '0');
              // We could fetch move details here in a real implementation
              return {
                ...move,
                id,
                type: 'normal' // This would come from the move details API
              };
            } catch (e) {
              console.error(`Error processing move ${move.name}:`, e);
              return move;
            }
          })
        );

        return {
          id: generation.id,
          name: generation.name,
          main_region: generation.main_region,
          names: generation.names,
          pokemon_species: pokemonSpecies,
          moves: movesWithDetails,
          version_groups: generation.version_groups
        };
      }, SIX_HOURS);
    } catch (error) {
      console.error(`Error fetching enhanced details for generation ${idOrName}:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const generationsService = new GenerationsService();
