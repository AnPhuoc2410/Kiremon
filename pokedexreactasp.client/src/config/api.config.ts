const BASE_API_URL = import.meta.env.VITE_POKEMON_API;
const POKEMON_IMAGE_URL = import.meta.env.VITE_POKEMON_IMAGE;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const GOOGLE_CLIENT_ID_KEY = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID_KEY = import.meta.env.VITE_FACEBOOK_APP_ID;
const GRAPHQL_ENDPOINT_URL = import.meta.env.VITE_GRAPHQL_ENDPOINT;
const POKEMON_SHOWDOWN_IMAGE_URL = import.meta.env.VITE_POKEMON_SHOWDOWN_IMAGE;
const normalizeUrl = (url: string): string => {
  return url.endsWith("/") ? url : `${url}/`;
};

// API endpoint configuration
export const API_CONFIG = {
  baseUrl: normalizeUrl(BASE_API_URL),
  graphqlEndpoint: GRAPHQL_ENDPOINT_URL,
  endpoints: {
    pokemon: "pokemon",
    species: "pokemon-species",
    evolution: "evolution-chain",
    types: "type",
    abilities: "ability",
    regions: "region",
    generations: "generation",
    pokedexes: "pokedex",
    moves: "move",
    items: "item",
    locations: "location",
    locationAreas: "location-area",
    forms: "pokemon-form",
  },
  imageUrl: POKEMON_IMAGE_URL,
};

// Helper to build endpoint URLs
export const buildEndpointUrl = (
  endpoint: keyof typeof API_CONFIG.endpoints,
): string => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
};

// For backwards compatibility
export const POKEMON_API = buildEndpointUrl("pokemon");
export const POKEMON_IMAGE = API_CONFIG.imageUrl;
export const POKEMON_SHOWDOWN_IMAGE = POKEMON_SHOWDOWN_IMAGE_URL;
export const RECAPTCHA_KEY = RECAPTCHA_SITE_KEY;
export const GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID_KEY;
export const FACEBOOK_APP_ID = FACEBOOK_APP_ID_KEY;
export const GRAPHQL_ENDPOINT = GRAPHQL_ENDPOINT_URL;
