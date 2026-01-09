import { ApiService } from "../api/api-client";
import { cacheUtils } from "../cache/cache";
import { buildEndpointUrl } from "../../config/api.config";
import { IPokemonType, ITypeDetails, INameUrlPair } from "../../types/pokemon";

class TypesService extends ApiService {
  constructor() {
    super(buildEndpointUrl("types"));
  }

  /**
   * Fetch all Pokemon types
   */
  async getAllTypes(): Promise<INameUrlPair[]> {
    const cacheKey = "types:all";
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache for types list

    try {
      return await cacheUtils.getOrSet(
        cacheKey,
        async () => {
          const response = await this.get<{ results: INameUrlPair[] }>("");
          return response.results || [];
        },
        ONE_DAY,
      );
    } catch (error) {
      console.error("Error fetching Pokemon types:", error);
      return [];
    }
  }

  /**
   * Fetch detailed type information including damage relations
   */
  async getTypeDetails(
    nameOrId: string | number,
  ): Promise<ITypeDetails | null> {
    if (!nameOrId) return null;
    const cacheKey = `types:detail:${nameOrId}`;
    const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours cache for type details

    try {
      return await cacheUtils.getOrSet(
        cacheKey,
        async () => {
          return this.get<ITypeDetails>(`/${nameOrId}`);
        },
        ONE_DAY,
      );
    } catch (error) {
      console.error(`Error fetching details for ${nameOrId} type:`, error);
      return null;
    }
  }

  /**
   * Fetch all Pokemon types with detailed information
   */
  async getAllTypesWithDetails(): Promise<IPokemonType[]> {
    const cacheKey = "types:allWithDetails";
    const ONE_HOUR = 60 * 60 * 1000; // 1 hour cache

    try {
      return await cacheUtils.getOrSet(
        cacheKey,
        async () => {
          const types = await this.getAllTypes();

          // Fetch detailed information for each type
          const typesWithDetails = await Promise.all(
            types
              // Filter out non-standard types
              .filter((type) => !["unknown", "shadow"].includes(type.name))
              .map(async (type) => {
                try {
                  const typeDetail = await this.getTypeDetails(type.name);

                  return {
                    name: type.name,
                    id: typeDetail?.id || 0,
                    pokemonCount: typeDetail?.pokemon?.length || 0,
                    damageRelations: typeDetail?.damage_relations,
                    url: type.url,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching details for ${type.name} type:`,
                    error,
                  );
                  return {
                    name: type.name,
                    id: 0,
                    pokemonCount: 0,
                    url: type.url,
                  };
                }
              }),
          );

          return typesWithDetails;
        },
        ONE_HOUR,
      );
    } catch (error) {
      console.error("Error fetching types with details:", error);
      return [];
    }
  }

  /**
   * Get Pokemon by type
   */
  async getPokemonByType(type: string): Promise<INameUrlPair[]> {
    if (!type) return [];
    const cacheKey = `types:pokemon:${type}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        const response = await this.getTypeDetails(type);
        // Get all Pokemon of the specified type
        const pokemonList = response?.pokemon || [];
        return pokemonList.map((p: any) => p.pokemon);
      });
    } catch (error) {
      console.error("Error fetching Pokemon by type:", error);
      return [];
    }
  }
}

// Export singleton instance
export const typesService = new TypesService();
