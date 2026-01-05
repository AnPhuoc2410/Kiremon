import { GRAPHQL_ENDPOINT } from '../../config/api.config';

interface PokeballSprite {
  default: string;
}

interface ItemSpriteData {
  sprites: PokeballSprite;
  item?: {
    name: string;
  };
}

interface PokeballResponse {
  data: {
    itemsprites: ItemSpriteData[];
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

interface HeldItemSprite {
  name: string;
  sprite: string;
}

async function executeGraphQLQuery(
  query: string,
  variables: Record<string, any> | null,
  operationName: string
): Promise<PokeballResponse> {
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

  const result: PokeballResponse = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL error: ${JSON.stringify(result.errors)}`);
  }

  return result;
}

export const pokeItemService = {
  async getHeldItemSprites(itemNames: string[]): Promise<HeldItemSprite[]> {
    if (!itemNames || itemNames.length === 0) return [];

    const query = `
      query getHeldItemSprites($names: [String!]) {
        itemsprites(
          where: {
            item: {
              name: { _in: $names }
            }
          }
          order_by: { id: asc }
        ) {
          item {
            name
          }
          sprites
        }
      }
    `;

    try {
      const result = await executeGraphQLQuery(
        query,
        { names: itemNames },
        "getHeldItemSprites"
      );

      return result.data?.itemsprites?.map(item => ({
        name: item.item?.name || '',
        sprite: item.sprites?.default || ''
      })).filter(item => item.name && item.sprite) || [];
    } catch (error) {
      console.error("Error fetching held item sprites:", error);
      return [];
    }
  },

  async getPokeballSprite(): Promise<string | null> {
    // Get selected pokeball from localStorage, default to timer-ball
    const selectedPokeball = localStorage.getItem('selectedPokeball') || 'timer-ball';
    
    const query = `
      query getPokeballSprite($name: String!) {
        itemsprites(
          where: {
            item: {
              name: { _eq: $name }
            }
          }
        ) {
          sprites
        }
      }
    `;

    try {
      const result = await executeGraphQLQuery(
        query,
        { name: selectedPokeball },
        "getPokeballSprite"
      );

      if (result.data?.itemsprites?.[0]?.sprites?.default) {
        return result.data.itemsprites[0].sprites.default;
      }

      console.warn("No pokeball sprite found, using fallback");
      // Fallback to hardcoded URL
      return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
    } catch {
      // Return fallback URL on error
      return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
    }
  },

  async getAllPokeballs(): Promise<HeldItemSprite[]> {
    const query = `
      query getAllPokeballs {
        itemsprites(
          where: {
            item: {
              name: { _like: "%-ball" }
            }
          }
          order_by: { id: asc }
        ) {
          item {
            name
          }
          sprites
        }
      }
    `;

    try {
      const result = await executeGraphQLQuery(
        query,
        null,
        "getAllPokeballs"
      );

      return result.data?.itemsprites?.map(item => ({
        name: item.item?.name || '',
        sprite: item.sprites?.default || ''
      })).filter(item => item.name && item.sprite) || [];
    } catch (error) {
      console.error("Error fetching pokeballs:", error);
      return [];
    }
  },

  async getPokeballSpriteByName(name: string): Promise<string | null> {
    const query = `
      query getPokeballSpriteByName($name: String!) {
        itemsprites(
          where: {
            item: {
              name: { _eq: $name }
            }
          }
        ) {
          sprites
        }
      }
    `;

    try {
      const result = await executeGraphQLQuery(
        query,
        { name },
        "getPokeballSpriteByName"
      );

      if (result.data?.itemsprites?.[0]?.sprites?.default) {
        return result.data.itemsprites[0].sprites.default;
      }

      console.warn(`No sprite found for ${name}, using fallback`);
      return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
    } catch {
      return "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png";
    }
  },
};
