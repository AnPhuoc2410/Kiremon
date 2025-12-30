// Friend-related types for the Friends feature

export enum FriendRequestStatus {
  Pending = 0,
  Accepted = 1,
  Declined = 2,
  Cancelled = 3,
}

/**
 * DTO for displaying a friend in the friends list
 */
export interface FriendDto {
  userId: string;
  username: string;
  avatarUrl: string | null;
  trainerLevel: number;
  favoriteType: string | null;
  friendsSince: string;
  friendshipLevel: number;
  isOnline: boolean;
  lastActiveDate: string;
  pokemonCaught: number;
  tradesWithFriend: number;
  battlesWithFriend: number;
  nickname: string | null;
}

/**
 * DTO for displaying a pending friend request
 */
export interface FriendRequestDto {
  requestId: number;
  userId: string;
  username: string;
  avatarUrl: string | null;
  trainerLevel: number;
  message: string | null;
  sentAt: string;
  status: FriendRequestStatus;
  isSentByMe: boolean;
}

/**
 * Request DTO for sending a friend request
 */
export interface SendFriendRequestDto {
  friendCode: string;
  message?: string;
}

/**
 * Response DTO for friend-related operations
 */
export interface FriendOperationResultDto {
  success: boolean;
  message: string;
  newFriend?: FriendDto;
}

/**
 * DTO for displaying user's friend code and QR data
 */
export interface FriendCodeDto {
  friendCode: string;
  qrCodeData: string;
  username: string;
  trainerLevel: number;
}

/**
 * DTO for searching users to add as friends
 */
export interface UserSearchResultDto {
  userId: string;
  username: string;
  avatarUrl: string | null;
  trainerLevel: number;
  friendCode: string;
  isFriend: boolean;
  hasPendingRequest: boolean;
}

/**
 * DTO for friends overview/summary
 */
export interface FriendsSummaryDto {
  totalFriends: number;
  onlineFriends: number;
  pendingRequestsReceived: number;
  pendingRequestsSent: number;
  myFriendCode: string;
}

/**
 * Request DTO for updating friend nickname
 */
export interface UpdateFriendNicknameDto {
  friendUserId: string;
  nickname: string | null;
}
