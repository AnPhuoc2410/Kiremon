import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  WildAreaResponse,
  WildCatchAttemptRequest,
  WildCatchResult,
} from "@/types/wild-area.types";

class WildAreaService extends AuthenticatedApiService {
  async getCurrent(): Promise<WildAreaResponse> {
    return this.get<WildAreaResponse>("/wild-area/current");
  }

  async attemptCatch(
    spawnId: number,
    payload: WildCatchAttemptRequest,
  ): Promise<WildCatchResult> {
    return this.post<WildCatchResult>(
      `/wild-area/spawns/${spawnId}/attempt-catch`,
      payload,
    );
  }
}

export const wildAreaService = new WildAreaService();
