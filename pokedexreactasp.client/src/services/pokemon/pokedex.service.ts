import { ApiService } from '../api/api-client';
import { cacheUtils } from '../cache/cache';
import { buildEndpointUrl } from '../../config/api.config';
import { IPokedex, INameUrlPair, IAPIResourceList } from '../../types/pokemon';

class PokedexService extends ApiService {
  constructor() {
    super(buildEndpointUrl('pokedexes'));
  }

  /**
   * Fetch all available pokedexes
   */
  async getAllPokedexes(): Promise<INameUrlPair[]> {
    const cacheKey = 'pokedexes:all';
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache for pokedex list

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const response = await this.get<IAPIResourceList>('');
        return response.results || [];
      }, ONE_DAY);
    } catch (error) {
      console.error("Error fetching pokedexes:", error);
      return [];
    }
  }

  /**
   * Fetch detailed pokedex data including pokemon entries
   */
  async getPokedexDetails(pokedexName: string): Promise<IPokedex | null> {
    if (!pokedexName) return null;
    const cacheKey = `pokedexes:detail:${pokedexName}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        return this.get<IPokedex>(`/${pokedexName}`);
      });
    } catch (error) {
      console.error(`Error fetching details for ${pokedexName} pokedex:`, error);
      return null;
    }
  }
}

// Export singleton instance
export const pokedexService = new PokedexService();