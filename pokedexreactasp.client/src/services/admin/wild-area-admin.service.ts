import { AuthenticatedApiService } from "@/services/api/api-client.auth";

class WildAreaAdminService extends AuthenticatedApiService {
  async getSettings(): Promise<any> {
    return this.get<any>("/admin/wild-area/settings");
  }

  async saveSettings(settings: any): Promise<void> {
    return this.post<void>("/admin/wild-area/settings", settings);
  }
}

export const wildAreaAdminService = new WildAreaAdminService();
