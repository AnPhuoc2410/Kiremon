import { ApiService } from "@/services/api/api-client";
import { cacheUtils } from "@/services/cache/cache";
import { buildEndpointUrl } from "@/config/api.config";
import { IRegion, INameUrlPair, IAPIResourceList } from "@/types/pokemon";

class RegionsService extends ApiService {
  constructor() {
    super(buildEndpointUrl("regions"));
  }

  /**
   * Fetch all available regions
   */
  async getAllRegions(): Promise<INameUrlPair[]> {
    const cacheKey = "regions:all";
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache for regions

    try {
      return await cacheUtils.getOrSet(
        cacheKey,
        async () => {
          const response = await this.get<IAPIResourceList>("");
          return response.results || [];
        },
        ONE_DAY,
      );
    } catch (error) {
      console.error("Error fetching regions:", error);
      return [];
    }
  }

  /**
   * Fetch detailed region data including locations
   */
  async getRegionDetails(regionName: string): Promise<IRegion | null> {
    if (!regionName) return null;
    const cacheKey = `regions:detail:${regionName}`;
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache for region details

    try {
      return await cacheUtils.getOrSet(
        cacheKey,
        async () => {
          return this.get<IRegion>(`/${regionName}`);
        },
        ONE_DAY,
      );
    } catch (error) {
      console.error(`Error fetching details for ${regionName} region:`, error);
      return null;
    }
  }

  /**
   * Get Pokemon by generation
   */
  async getPokemonByGeneration(gen: number | string): Promise<INameUrlPair[]> {
    if (!gen) return [];
    const cacheKey = `generations:pokemon:${gen}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        // Create a generations service
        const genService = new ApiService(buildEndpointUrl("generations"));
        const response = await genService.get<{
          pokemon_species: INameUrlPair[];
        }>(`/${gen}`);

        // Get Pokemon from the generation
        const pokemonList = response.pokemon_species || [];
        const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 6); // Return up to 6 random Pokemon
      });
    } catch (error) {
      console.error("Error fetching related Pokemon by generation:", error);
      return [];
    }
  }
}

// Export singleton instance
export const regionsService = new RegionsService();
