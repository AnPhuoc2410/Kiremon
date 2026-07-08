import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import type { CardRewardSettings } from "@/types/card-reward.types";

class CardRewardAdminService extends AuthenticatedApiService {
  getSettings(): Promise<CardRewardSettings> {
    return this.get<CardRewardSettings>("/admin/card-reward/settings");
  }

  saveSettings(settings: CardRewardSettings): Promise<void> {
    return this.post<void>("/admin/card-reward/settings", settings);
  }
}

export const cardRewardAdminService = new CardRewardAdminService();
