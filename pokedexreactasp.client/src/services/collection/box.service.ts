import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  UserBoxDto,
  UpdateBoxDto,
  MovePokemonDto,
  BatchMovePokemonDto,
  ReorderBoxesDto,
  MovePokemonResultDto,
  BatchMoveResultDto,
} from "@/types/box.types";

class BoxService extends AuthenticatedApiService {
  /**
   * Get all boxes for the user
   */
  async getBoxes(): Promise<UserBoxDto[]> {
    return this.get<UserBoxDto[]>("/User/boxes");
  }

  /**
   * Get details for a specific box
   */
  async getBox(boxId: number): Promise<UserBoxDto> {
    return this.get<UserBoxDto>(`/User/boxes/${boxId}`);
  }

  /**
   * Update box name and wallpaper
   */
  async updateBox(boxId: number, data: UpdateBoxDto): Promise<UserBoxDto> {
    return this.put<UserBoxDto>(`/User/boxes/${boxId}`, data);
  }

  /**
   * Move a single Pokemon (supports swap/party constraints)
   */
  async movePokemon(
    userPokemonId: number,
    data: MovePokemonDto,
  ): Promise<MovePokemonResultDto> {
    return this.put<MovePokemonResultDto>(`/User/pokemon/${userPokemonId}/move`, data);
  }

  /**
   * Move a batch of Pokemon (Group Move)
   */
  async movePokemonBatch(data: BatchMovePokemonDto): Promise<BatchMoveResultDto> {
    return this.put<BatchMoveResultDto>("/User/pokemon/move-batch", data);
  }

  /**
   * Reorder display position of two boxes
   */
  async reorderBoxes(data: ReorderBoxesDto): Promise<void> {
    return this.put<void>("/User/boxes/reorder", data);
  }
}

export const boxService = new BoxService();
