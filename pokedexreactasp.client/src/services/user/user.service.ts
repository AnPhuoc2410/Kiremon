import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  UserProfile,
  UpdateProfileRequest,
  UserAchievement,
} from "@/types/users.type";

class UserService extends AuthenticatedApiService {
  async getProfile(): Promise<UserProfile> {
    return this.get<UserProfile>("/User/profile");
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    return this.put<void>("/User/profile", data);
  }

  async getAchievements(): Promise<UserAchievement[]> {
    return this.get<UserAchievement[]>("/User/achievements");
  }

  async unlockAchievement(achievementId: string): Promise<any> {
    return this.post<any>(`/User/achievements/unlock/${achievementId}`);
  }
}

export const userService = new UserService();
