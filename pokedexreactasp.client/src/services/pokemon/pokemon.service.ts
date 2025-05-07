import { ApiService } from '../api/api-client';
import { cacheUtils } from '../cache/cache';
import { API_CONFIG, buildEndpointUrl } from '../../config/api.config';
import {
  IAllPokemonResponse,
  IPokemonDetailResponse,
  IAPIResponse
} from '../../types/pokemon';

class PokemonService extends ApiService {
  constructor() {
    super(buildEndpointUrl('pokemon'));
  }

  /**
   * Get a list of all Pokemon with pagination
   */
  async getAllPokemon(limit: number = 50, offset: number = 0): Promise<IAllPokemonResponse> {
    const cacheKey = `pokemon:all:${limit}:${offset}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        return this.get<IAllPokemonResponse>('', {
          params: { limit, offset }
        });
      });
    } catch (error) {
      console.error("Error fetching all Pokemon:", error);
      return { count: 0, next: "", previous: "", results: [] };
    }
  }

  /**
   * Get detailed information about a single Pokemon
   */
  async getPokemonDetail(nameOrId: string | number): Promise<IPokemonDetailResponse | null> {
    if (!nameOrId) return null;
    const cacheKey = `pokemon:detail:${nameOrId}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        return this.get<IPokemonDetailResponse>(`/${nameOrId}`);
      });
    } catch (error) {
      console.error(`Error fetching details for Pokemon ${nameOrId}:`, error);
      return null;
    }
  }

  /**
   * Get Pokemon with their types
   */
  async getPokemonWithTypes(limit: number = 20, offset: number = 0): Promise<IAllPokemonResponse> {
    const cacheKey = `pokemon:withTypes:${limit}:${offset}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        // Get the list of pokemon
        const response = await this.get<IAllPokemonResponse>('', {
          params: { limit, offset }
        });

        const results = response.results;

        // Get detailed info for each pokemon to fetch types
        const detailedPokemon = await Promise.all(
          results.map(async (pokemon) => {
            const details = await this.getPokemonDetail(pokemon.name);

            if (details) {
              const types = details.types.map((t) => t.type.name);
              return {
                ...pokemon,
                types: types,
                id: details.id
              };
            }

            return { ...pokemon, types: [], id: 0 };
          })
        );

        return {
          ...response,
          results: detailedPokemon
        };
      });
    } catch (error) {
      console.error("Error fetching pokemon with types:", error);
      return { count: 0, next: "", previous: "", results: [] };
    }
  }

  /**
   * Fetch Pokemon forms (variants)
   */
  async getPokemonForms(nameOrId: string | number): Promise<any> {
    if (!nameOrId) return null;
    const cacheKey = `pokemon:forms:${nameOrId}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const formsService = new ApiService(buildEndpointUrl('forms'));
        return formsService.get(`/${nameOrId}`);
      });
    } catch (error) {
      console.error("Error fetching Pokemon forms:", error);
      return null;
    }
  }
}

// Export singleton instance
export const pokemonService = new PokemonService();
