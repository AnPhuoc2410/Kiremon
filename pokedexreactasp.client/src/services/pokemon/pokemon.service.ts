import { ApiService } from "../api/api-client";
import { cacheUtils } from "../cache/cache";
import { buildEndpointUrl, GRAPHQL_ENDPOINT } from "../../config/api.config";
import {
  IAllPokemonResponse,
  IPokemonDetailResponse,
} from "../../types/pokemon";

interface PokemonGraphQLResult {
  id: number;
  name: string;
}

interface SearchPokemonResponse {
  data: {
    pokemon: PokemonGraphQLResult[];
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

async function executeGraphQLQuery(
  query: string,
  variables: Record<string, any>,
  operationName: string,
): Promise<SearchPokemonResponse> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify({
      query,
      variables,
      operationName,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to execute GraphQL query: ${operationName}`);
  }

  const result: SearchPokemonResponse = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result;
}

class PokemonService extends ApiService {
  constructor() {
    super(buildEndpointUrl("pokemon"));
  }

  /**
   * Get a list of all Pokemon with pagination
   */
  async getAllPokemon(
    limit: number = 50,
    offset: number = 0,
  ): Promise<IAllPokemonResponse> {
    const cacheKey = `pokemon:all:${limit}:${offset}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        return this.get<IAllPokemonResponse>("", {
          params: { limit, offset },
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
  async getPokemonDetail(
    nameOrId: string | number,
  ): Promise<IPokemonDetailResponse | null> {
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
  async getPokemonWithTypes(
    limit: number = 20,
    offset: number = 0,
  ): Promise<IAllPokemonResponse> {
    const cacheKey = `pokemon:withTypes:${limit}:${offset}`;

    try {
      return await cacheUtils.getOrSet(cacheKey, async () => {
        // Get the list of pokemon
        const response = await this.get<IAllPokemonResponse>("", {
          params: { limit, offset },
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
                id: details.id,
              };
            }

            return { ...pokemon, types: [], id: 0 };
          }),
        );

        return {
          ...response,
          results: detailedPokemon,
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
        const formsService = new ApiService(buildEndpointUrl("forms"));
        return formsService.get(`/${nameOrId}`);
      });
    } catch (error) {
      console.error("Error fetching Pokemon forms:", error);
      return null;
    }
  }

  /**
   * Search Pokemon using GraphQL (by ID or name)
   * Returns array of matching Pokemon
   */
  async searchPokemonGraphQL(query: string): Promise<PokemonGraphQLResult[]> {
    if (!query.trim()) return [];

    try {
      // Determine if query is a number (ID) or text (name)
      const isIdSearch = /^\d+$/.test(query.trim());

      let graphqlQuery: string;
      let variables: Record<string, any>;

      if (isIdSearch) {
        // Search by ID
        graphqlQuery = `
          query searchPokemonById($id: Int!) {
            pokemon(
              where: {
                id: { _eq: $id }
              }
            ) {
              id
              name
            }
          }
        `;
        variables = { id: parseInt(query) };
      } else {
        // Search by name
        graphqlQuery = `
          query searchPokemonByName($name: String!) {
            pokemon(
              where: {
                name: { _like: $name }
              }
              order_by: { id: asc }
            ) {
              id
              name
            }
          }
        `;
        variables = { name: `%${query.toLowerCase()}%` };
      }

      const result = await executeGraphQLQuery(
        graphqlQuery,
        variables,
        isIdSearch ? "searchPokemonById" : "searchPokemonByName",
      );

      if (!result.data?.pokemon || result.data.pokemon.length === 0) {
        return [];
      }

      return result.data.pokemon;
    } catch (error) {
      console.error("Failed to search Pokemon:", error);
      return [];
    }
  }

  /**
   * Load Pokemon list using GraphQL with pagination
   */
  async loadPokemonGraphQL(
    limit: number = 20,
    offset: number = 0,
  ): Promise<PokemonGraphQLResult[]> {
    try {
      const graphqlQuery = `
        query loadPokemons($limit: Int!, $offset: Int!) {
          pokemon(
            limit: $limit
            offset: $offset
          ) {
            id
            name
          }
        }
      `;

      const result = await executeGraphQLQuery(
        graphqlQuery,
        { limit, offset },
        "loadPokemons",
      );

      return result.data?.pokemon || [];
    } catch (error) {
      console.error("Failed to load Pokemon:", error);
      return [];
    }
  }
}

// Export singleton instance
export const pokemonService = new PokemonService();
