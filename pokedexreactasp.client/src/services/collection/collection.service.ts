import axios from "axios";
import { getCookie } from "../../components/utils/cookieUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// ============== Types ==============

export interface UserPokemonDto {
  id: number;
  userId: string;
  pokemonApiId: number;
  nickname: string | null;
  isFavorite: boolean;
  isShiny: boolean;
  caughtDate: string;
  caughtLocation: string | null;
  caughtLevel: number;
  currentLevel: number;
  currentExperience: number;
  experienceToNextLevel: number;
  currentHp: number;
  maxHp: number;
  // IVs
  ivHp: number | null;
  ivAttack: number | null;
  ivDefense: number | null;
  ivSpecialAttack: number | null;
  ivSpecialDefense: number | null;
  ivSpeed: number | null;
  ivTotal: number | null;
  ivRating: string | null;
  // EVs
  evHp: number;
  evAttack: number;
  evDefense: number;
  evSpecialAttack: number;
  evSpecialDefense: number;
  evSpeed: number;
  evTotal: number;
  // Battle
  battlesWon: number;
  battlesLost: number;
  totalBattles: number;
  winRate: number;
  // Gameplay
  friendship: number;
  friendshipLevel: string;
  canEvolve: boolean;
  isTraded: boolean;
  originalTrainerName: string | null;
  // From PokeAPI
  name: string;
  displayName: string;
  type1: string;
  type2: string | null;
  height: number;
  weight: number;
  spriteUrl: string;
  officialArtworkUrl: string | null;
  abilities: string[];
  // Base stats
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseSpecialAttack: number;
  baseSpecialDefense: number;
  baseSpeed: number;
  baseStatTotal: number;
  // Calculated stats
  calculatedHp: number;
  calculatedAttack: number;
  calculatedDefense: number;
  calculatedSpecialAttack: number;
  calculatedSpecialDefense: number;
  calculatedSpeed: number;
  notes: string | null;
}

export interface CatchPokemonRequest {
  pokemonApiId: number;
  nickname?: string;
  caughtLocation?: string;
  caughtLevel?: number;
  isShiny?: boolean;
}

export interface CatchResultDto {
  success: boolean;
  message: string;
  caughtPokemon: UserPokemonDto | null;
  experienceGained: number;
  isNewSpecies: boolean;
  trainerLeveledUp: boolean;
  newTrainerLevel: number;
  ivTotal: number;
  ivRating: string;
}

export interface CollectionStatsDto {
  totalCaught: number;
  uniqueCaught: number;
  shinyCount: number;
  favoriteCount: number;
  totalBattles: number;
  totalBattlesWon: number;
  highestLevel: number;
  averageLevel: number;
  typeDistribution: Record<string, number>;
}

// Summary for list view
export interface UserPokemonSummaryDto {
  id: number;
  pokemonApiId: number;
  name: string;
  displayName: string;
  type1: string;
  type2: string | null;
  spriteUrl: string;
  currentLevel: number;
  isFavorite: boolean;
  isShiny: boolean;
  currentHp: number;
  maxHp: number;
}

export interface LocalPokemonDto {
  name: string;
  nickname: string;
  sprite?: string;
}

export interface SyncResultDto {
  message: string;
  syncedCount: number;
}

// ============== Service ==============

class CollectionService {
  private getAuthHeader() {
    const token = getCookie("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Get all Pokemon in user's collection
   */
  async getCollection(): Promise<UserPokemonDto[]> {
    const response = await axios.get<UserPokemonDto[]>(
      `${API_BASE_URL}/User/pokemon`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /**
   * Get a specific Pokemon by ID
   */
  async getPokemonById(userPokemonId: number): Promise<UserPokemonDto> {
    const response = await axios.get<UserPokemonDto>(
      `${API_BASE_URL}/User/pokemon/${userPokemonId}`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /**
   * Get collection statistics
   */
  async getStats(): Promise<CollectionStatsDto> {
    const response = await axios.get<CollectionStatsDto>(
      `${API_BASE_URL}/User/pokemon/stats`,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /**
   * Catch a Pokemon
   */
  async catchPokemon(request: CatchPokemonRequest): Promise<CatchResultDto> {
    const response = await axios.post<CatchResultDto>(
      `${API_BASE_URL}/User/pokemon/catch`,
      request,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /**
   * Release a Pokemon
   */
  async releasePokemon(userPokemonId: number): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/User/pokemon/${userPokemonId}`,
      { headers: this.getAuthHeader() }
    );
  }

  /**
   * Update Pokemon nickname
   */
  async updateNickname(userPokemonId: number, nickname: string): Promise<void> {
    await axios.put(
      `${API_BASE_URL}/User/pokemon/${userPokemonId}/nickname`,
      { nickname },
      { headers: this.getAuthHeader() }
    );
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(userPokemonId: number): Promise<void> {
    await axios.put(
      `${API_BASE_URL}/User/pokemon/${userPokemonId}/favorite`,
      {},
      { headers: this.getAuthHeader() }
    );
  }

  /**
   * Update Pokemon notes
   */
  async updateNotes(userPokemonId: number, notes: string): Promise<void> {
    await axios.put(
      `${API_BASE_URL}/User/pokemon/${userPokemonId}/notes`,
      { notes },
      { headers: this.getAuthHeader() }
    );
  }

  /**
   * Sync Pokemon from localStorage to server
   */
  async syncFromLocalStorage(localPokemon: LocalPokemonDto[]): Promise<SyncResultDto> {
    const response = await axios.post<SyncResultDto>(
      `${API_BASE_URL}/User/pokemon/sync`,
      localPokemon,
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!getCookie("accessToken");
  }
}

export const collectionService = new CollectionService();



