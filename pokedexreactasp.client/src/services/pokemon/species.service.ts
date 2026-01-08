import { ApiService } from "../api/api-client";
import { cacheUtils } from "../cache/cache";
import { buildEndpointUrl } from "../../config/api.config";
import { IPokemonSpecies, IEvolutionChain } from "../../types/pokemon";

class SpeciesService extends ApiService {
  constructor() {
    super(buildEndpointUrl("species"));
  }

  /**
   * Fetch Pokemon species data which includes evolution chain URL
   */
  async getPokemonSpecies(
    nameOrId: string | number,
  ): Promise<IPokemonSpecies | null> {
    if (!nameOrId) return null;
    const cacheKey = `species:${nameOrId}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        return this.get<IPokemonSpecies>(`/${nameOrId}`);
      });
    } catch (error) {
      console.error("Error fetching Pokemon species:", error);
      return null;
    }
  }

  /**
   * Fetch evolution chain data
   */
  async getEvolutionChain(url: string): Promise<IEvolutionChain | null> {
    if (!url) return null;
    // Extract the ID from the URL to use as a cache key
    const id = url.split("/").filter(Boolean).pop();
    const cacheKey = `evolution:${id}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        // Direct API call using axios instead of this.get because the full URL is provided
        const evolutionService = new ApiService("");
        return evolutionService.get<IEvolutionChain>(url);
      });
    } catch (error) {
      console.error("Error fetching evolution chain:", error);
      return null;
    }
  }

  /**
   * Convenience method to get species and evolution in one call
   */
  async getSpeciesWithEvolution(nameOrId: string | number): Promise<{
    species: IPokemonSpecies | null;
    evolution: IEvolutionChain | null;
  }> {
    const species = await this.getPokemonSpecies(nameOrId);

    if (!species || !species.evolution_chain?.url) {
      return { species, evolution: null };
    }

    const evolution = await this.getEvolutionChain(species.evolution_chain.url);
    return { species, evolution };
  }
}

// Export singleton instance
export const speciesService = new SpeciesService();
