const BASE_API_URL = import.meta.env.VITE_POKEMON_API;
const POKEMON_IMAGE_URL = import.meta.env.VITE_POKEMON_IMAGE;

const normalizeUrl = (url: string): string => {
  return url.endsWith('/') ? url : `${url}/`;
};

// API endpoint configuration
export const API_CONFIG = {
  baseUrl: normalizeUrl(BASE_API_URL),
  endpoints: {
    pokemon: 'pokemon',
    species: 'pokemon-species',
    evolution: 'evolution-chain',
    types: 'type',
    abilities: 'ability',
    regions: 'region',
    generations: 'generation',
    pokedexes: 'pokedex',
    moves: 'move',
    items: 'item',
    locations: 'location',
    locationAreas: 'location-area',
    forms: 'pokemon-form',
  },
  imageUrl: POKEMON_IMAGE_URL
};

// Helper to build endpoint URLs
export const buildEndpointUrl = (endpoint: keyof typeof API_CONFIG.endpoints): string => {
  return `${API_CONFIG.baseUrl}${API_CONFIG.endpoints[endpoint]}`;
};

// For backwards compatibility
export const POKEMON_API = buildEndpointUrl('pokemon');
export const POKEMON_IMAGE = API_CONFIG.imageUrl;
