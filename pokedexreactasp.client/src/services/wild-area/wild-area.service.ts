import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  WildAreaOption,
  WildAreaResponse,
  WildCatchAttemptRequest,
  WildCatchResult,
} from "@/types/wild-area.types";

class WildAreaService extends AuthenticatedApiService {
  async getAreas(): Promise<WildAreaOption[]> {
    return this.get<WildAreaOption[]>("/wild-area/areas");
  }

  async getCurrent(areaCode?: string): Promise<WildAreaResponse> {
    return this.get<WildAreaResponse>("/wild-area/current", {
      params: { areaCode },
    });
  }

  async refreshCurrent(areaCode?: string): Promise<WildAreaResponse> {
    return this.post<WildAreaResponse>("/wild-area/refresh", undefined, {
      params: { areaCode },
    });
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
