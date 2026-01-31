import { AuthenticatedApiService } from "@/services/api/api-client.auth";
import {
  FriendDto,
  FriendRequestDto,
  SendFriendRequestDto,
  FriendOperationResultDto,
  FriendCodeDto,
  UserSearchResultDto,
  FriendsSummaryDto,
  UpdateFriendNicknameDto,
} from "@/types/friend.types";

class FriendService extends AuthenticatedApiService {
  // Friend Code & QR
  async getMyFriendCode(): Promise<FriendCodeDto> {
    return this.get<FriendCodeDto>("/Friend/code");
  }

  async regenerateFriendCode(): Promise<FriendCodeDto> {
    return this.post<FriendCodeDto>("/Friend/code/regenerate");
  }

  // Friend Requests
  async sendFriendRequest(
    request: SendFriendRequestDto,
  ): Promise<FriendOperationResultDto> {
    return this.post<FriendOperationResultDto>("/Friend/request", request);
  }

  async getReceivedRequests(): Promise<FriendRequestDto[]> {
    return this.get<FriendRequestDto[]>("/Friend/requests/received");
  }

  async getSentRequests(): Promise<FriendRequestDto[]> {
    return this.get<FriendRequestDto[]>("/Friend/requests/sent");
  }

  async acceptRequest(requestId: number): Promise<FriendOperationResultDto> {
    return this.post<FriendOperationResultDto>(
      `/Friend/request/${requestId}/accept`,
    );
  }

  async declineRequest(requestId: number): Promise<FriendOperationResultDto> {
    return this.post<FriendOperationResultDto>(
      `/Friend/request/${requestId}/decline`,
    );
  }

  async cancelRequest(requestId: number): Promise<FriendOperationResultDto> {
    return this.delete<FriendOperationResultDto>(
      `/Friend/request/${requestId}`,
    );
  }

  // Friends List
  async getFriends(): Promise<FriendDto[]> {
    return this.get<FriendDto[]>("/Friend");
  }

  async getFriendsSummary(): Promise<FriendsSummaryDto> {
    return this.get<FriendsSummaryDto>("/Friend/summary");
  }

  async removeFriend(friendUserId: string): Promise<FriendOperationResultDto> {
    return this.delete<FriendOperationResultDto>(`/Friend/${friendUserId}`);
  }

  async updateFriendNickname(request: UpdateFriendNicknameDto): Promise<void> {
    return this.put<void>("/Friend/nickname", request);
  }

  // Search & Discovery
  async searchUsers(searchTerm: string): Promise<UserSearchResultDto[]> {
    return this.get<UserSearchResultDto[]>(
      `/Friend/search?q=${encodeURIComponent(searchTerm)}`,
    );
  }

  async findByFriendCode(friendCode: string): Promise<UserSearchResultDto> {
    return this.get<UserSearchResultDto>(
      `/Friend/find/${encodeURIComponent(friendCode)}`,
    );
  }
}

export const friendService = new FriendService();
