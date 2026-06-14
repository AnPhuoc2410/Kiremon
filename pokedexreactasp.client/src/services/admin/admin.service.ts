import { AuthenticatedApiService } from "@/services/api/api-client.auth";

export interface AdminTrainer {
  id: string;
  username: string;
  email: string;
  level: number;
  coins: number;
  experience: number;
  pokemonCaught: number;
  emailConfirmed: boolean;
  lastActiveDate: string;
}

export interface AdminStats {
  totalUsers: number;
  totalPokemonCaught: number;
  totalBoxes: number;
  users: AdminTrainer[];
}

export interface SpawnSyncResult {
  totalChecked: number;
  totalSynced: number;
  success: boolean;
  message?: string;
}

export interface BiomeTagResult {
  totalProcessed: number;
  totalTagsCreated: number;
  success: boolean;
  message?: string;
}

class AdminService extends AuthenticatedApiService {
  /**
   * Fetch admin stats and user list
   */
  async getStats(): Promise<AdminStats> {
    return this.get<AdminStats>("/admin/stats");
  }

  /**
   * Trigger wild area spawn metadata sync
   */
  async syncSpawnMetadata(force: boolean = false): Promise<SpawnSyncResult> {
    return this.post<SpawnSyncResult>(`/admin/wild-area/sync-spawn-metadata?force=${force}`);
  }

  /**
   * Trigger biome tags regeneration
   */
  async regenerateBiomeTags(clearAuto: boolean = true): Promise<BiomeTagResult> {
    return this.post<BiomeTagResult>(`/admin/wild-area/regenerate-biome-tags?clearAuto=${clearAuto}`);
  }
}

export const adminService = new AdminService();
export default adminService;
