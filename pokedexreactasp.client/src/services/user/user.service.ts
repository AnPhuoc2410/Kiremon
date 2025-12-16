import { AuthenticatedApiService } from "../api/api-client.auth";
import { UserProfile, UpdateProfileRequest } from "../../types/users.type";

class UserService extends AuthenticatedApiService {
  async getProfile(): Promise<UserProfile> {
    return this.get<UserProfile>("/User/profile");
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    return this.put<void>("/User/profile", data);
  }
}

export const userService = new UserService();
