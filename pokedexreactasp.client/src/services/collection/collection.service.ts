import { AuthenticatedApiService } from "../api/api-client.auth";
import {
  CatchPokemonRequest,
  CatchResultDto,
  CollectionStatsDto,
  PokeSummaryResponseDto,
  UserPokemonDto,
} from "../../types/userspokemon.types";

class CollectionService extends AuthenticatedApiService {
  /**
   * Get all Pokemon in user's collection
   */
  async getCollection(): Promise<UserPokemonDto[]> {
    return this.get<UserPokemonDto[]>("/User/pokemon");
  }

  /**
   * Get a specific Pokemon by ID
   */
  async getPokemonById(userPokemonId: number): Promise<UserPokemonDto> {
    return this.get<UserPokemonDto>(`/User/pokemon/${userPokemonId}`);
  }

  /**
   * Get collection statistics
   */
  async getStats(): Promise<CollectionStatsDto> {
    return this.get<CollectionStatsDto>("/User/pokemon/stats");
  }

  /**
   * Get Pokemon summary (optimized for captured status)
   */
  async getPokeSummary(): Promise<PokeSummaryResponseDto> {
    return this.get<PokeSummaryResponseDto>("/User/pokemon/summary");
  }

  /**
   * Catch a Pokemon
   */
  async catchPokemon(request: CatchPokemonRequest): Promise<CatchResultDto> {
    return this.post<CatchResultDto>("/User/pokemon/catch", request);
  }

  /**
   * Release a Pokemon
   */
  async releasePokemon(userPokemonId: number): Promise<void> {
    return this.delete<void>(`/User/pokemon/${userPokemonId}`);
  }

  /**
   * Update Pokemon nickname
   */
  async updateNickname(userPokemonId: number, nickname: string): Promise<void> {
    return this.put<void>(`/User/pokemon/${userPokemonId}/nickname`, {
      nickname,
    });
  }

  /**
   * Toggle favorite status
   */
  async toggleFavorite(userPokemonId: number): Promise<void> {
    return this.put<void>(`/User/pokemon/${userPokemonId}/favorite`, {});
  }

  /**
   * Update Pokemon notes
   */
  async updateNotes(userPokemonId: number, notes: string): Promise<void> {
    return this.put<void>(`/User/pokemon/${userPokemonId}/notes`, { notes });
  }
}

export const collectionService = new CollectionService();



