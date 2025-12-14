const GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2";

interface PokeballSprite {
  default: string;
}

interface ItemSpriteData {
  sprites: PokeballSprite;
}

interface PokeballResponse {
  data: {
    itemsprites: ItemSpriteData[];
  };
}

export const pokeItemService = {
  async getPokeballSprite(): Promise<string | null> {
    const query = `
      query getPokeballSprite {
        itemsprites(
          where: {
            item: {
              name: { _eq: "master-ball" }
            }
          }
        ) {
          sprites
        }
      }
    `;

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
        body: JSON.stringify({
          query,
          variables: null,
          operationName: "getPokeballSprite",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pokeball sprite");
      }

      const result: PokeballResponse = await response.json();

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
};
