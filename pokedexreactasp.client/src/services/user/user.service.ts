import axios from "axios";
import { getCookie } from "../../components/utils/cookieUtils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
  dateJoined: string;
  pokemonCaught: number;
  level: number;
  experience: number;
}

export interface UpdateProfileRequest {
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}

class UserService {
  private getAuthHeader() {
    const token = getCookie("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getProfile(): Promise<UserProfile> {
    const response = await axios.get<UserProfile>(
      `${API_BASE_URL}/User/profile`,
      {
        headers: this.getAuthHeader(),
      },
    );
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<void> {
    await axios.put(`${API_BASE_URL}/User/profile`, data, {
      headers: this.getAuthHeader(),
    });
  }
}

export const userService = new UserService();
