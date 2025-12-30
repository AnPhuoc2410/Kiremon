import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import { Header, Loading, Navbar } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { friendService } from "../../services";
import {
  FriendDto,
  FriendRequestDto,
  FriendsSummaryDto,
  FriendCodeDto,
} from "../../types/friend.types";
import * as S from "./index.style";
import {
  FriendsIcon,
  RequestIcon,
  AddIcon,
  QRIcon,
  CopyIcon,
  RefreshIcon,
  TradeIcon,
  BattleIcon,
  DeleteIcon,
  CheckIcon,
  XIcon,
} from "./icons";

// Tab types
type TabType = "friends" | "requests" | "add";

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("friends");
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<FriendRequestDto[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequestDto[]>([]);
  const [summary, setSummary] = useState<FriendsSummaryDto | null>(null);
  const [friendCode, setFriendCode] = useState<FriendCodeDto | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [inputCode, setInputCode] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState<FriendDto | null>(null);

  // Generate QR code data URL
  useEffect(() => {
    if (friendCode?.qrCodeData) {
      QRCode.toDataURL(friendCode.qrCodeData, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      }).then(setQrCodeDataUrl);
    }
  }, [friendCode?.qrCodeData]);

  // Format friend code input
  const formatFriendCode = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    const parts = [];
    for (let i = 0; i < cleaned.length && i < 12; i += 4) {
      parts.push(cleaned.slice(i, i + 4));
    }
    return parts.join("-");
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputCode(formatFriendCode(e.target.value));
  };

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [friendsData, summaryData, codeData, receivedData, sentData] =
        await Promise.all([
          friendService.getFriends(),
          friendService.getFriendsSummary(),
          friendService.getMyFriendCode(),
          friendService.getReceivedRequests(),
          friendService.getSentRequests(),
        ]);
      setFriends(friendsData);
      setSummary(summaryData);
      setFriendCode(codeData);
      setReceivedRequests(receivedData);
      setSentRequests(sentData);
    } catch (error) {
      console.error("Failed to load friends data:", error);
      toast.error("Failed to load friends data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/auth/login", { replace: true });
      return;
    }
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, isInitialized, navigate, loadData]);

  // Actions
  const copyFriendCode = () => {
    if (friendCode) {
      navigator.clipboard.writeText(friendCode.friendCode);
      toast.success("Friend code copied!");
    }
  };

  const regenerateCode = async () => {
    try {
      const newCode = await friendService.regenerateFriendCode();
      setFriendCode(newCode);
      toast.success("New friend code generated!");
    } catch (error) {
      toast.error("Failed to regenerate code");
    }
  };

  const sendFriendRequest = async () => {
    if (inputCode.length !== 14) {
      toast.error("Please enter a valid friend code (XXXX-XXXX-XXXX)");
      return;
    }

    try {
      const result = await friendService.sendFriendRequest({
        friendCode: inputCode,
      });
      if (result.success) {
        toast.success(result.message);
        setInputCode("");
        loadData();
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  const acceptRequest = async (requestId: number) => {
    try {
      const result = await friendService.acceptRequest(requestId);
      if (result.success) {
        toast.success(result.message);
        loadData();
      }
    } catch (error) {
      toast.error("Failed to accept request");
    }
  };

  const declineRequest = async (requestId: number) => {
    try {
      const result = await friendService.declineRequest(requestId);
      if (result.success) {
        toast.success(result.message);
        loadData();
      }
    } catch (error) {
      toast.error("Failed to decline request");
    }
  };

  const cancelRequest = async (requestId: number) => {
    try {
      const result = await friendService.cancelRequest(requestId);
      if (result.success) {
        toast.success(result.message);
        loadData();
      }
    } catch (error) {
      toast.error("Failed to cancel request");
    }
  };

  const removeFriend = async () => {
    if (!confirmRemove) return;
    try {
      const result = await friendService.removeFriend(confirmRemove.userId);
      if (result.success) {
        toast.success(result.message);
        setConfirmRemove(null);
        loadData();
      }
    } catch (error) {
      toast.error("Failed to remove friend");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isInitialized || loading) {
    return <Loading />;
  }

  const totalPendingRequests =
    receivedRequests.length + sentRequests.length;

  return (
    <S.Container>
      <Header title="Friends" />

      <S.ContentWrapper>
        {/* Stats Summary */}
        <S.StatGrid>
          <S.StatCard>
            <h4>{summary?.totalFriends || 0}</h4>
            <p>Total Friends</p>
          </S.StatCard>
          <S.StatCard>
            <h4>{summary?.onlineFriends || 0}</h4>
            <p>Online Now</p>
          </S.StatCard>
        </S.StatGrid>

        {/* Tabs */}
        <S.TabContainer>
          <S.Tab
            $active={activeTab === "friends"}
            onClick={() => setActiveTab("friends")}
          >
            <FriendsIcon />
            Friends
          </S.Tab>
          <S.Tab
            $active={activeTab === "requests"}
            onClick={() => setActiveTab("requests")}
          >
            <RequestIcon />
            Requests
            {totalPendingRequests > 0 && (
              <S.Badge>{totalPendingRequests}</S.Badge>
            )}
          </S.Tab>
          <S.Tab
            $active={activeTab === "add"}
            onClick={() => setActiveTab("add")}
          >
            <AddIcon />
            Add Friend
          </S.Tab>
        </S.TabContainer>

        {/* Friends Tab */}
        {activeTab === "friends" && (
          <S.Section>
            <S.SectionTitle>
              <FriendsIcon />
              My Friends ({friends.length})
            </S.SectionTitle>

            {friends.length === 0 ? (
              <S.EmptyState>
                <FriendsIcon />
                <h3>No friends yet</h3>
                <p>Add friends using their friend code or QR code!</p>
              </S.EmptyState>
            ) : (
              <S.FriendsList>
                {friends.map((friend) => (
                  <S.FriendCard key={friend.userId} $online={friend.isOnline}>
                    <S.FriendAvatar $online={friend.isOnline}>
                      {friend.avatarUrl ? (
                        <img src={friend.avatarUrl} alt={friend.username} />
                      ) : (
                        friend.username.charAt(0).toUpperCase()
                      )}
                    </S.FriendAvatar>
                    <S.FriendInfo>
                      <S.FriendName>
                        {friend.nickname || friend.username}
                        <S.LevelBadge>Lv.{friend.trainerLevel}</S.LevelBadge>
                      </S.FriendName>
                      <S.FriendDetails>
                        Friends since {formatDate(friend.friendsSince)}
                      </S.FriendDetails>
                      <S.OnlineStatus $online={friend.isOnline}>
                        {friend.isOnline ? (
                          <>● Online</>
                        ) : (
                          <>Last seen {getTimeAgo(friend.lastActiveDate)}</>
                        )}
                      </S.OnlineStatus>
                      <S.FriendshipStats>
                        <S.FriendshipStat>
                          <TradeIcon />
                          {friend.tradesWithFriend} trades
                        </S.FriendshipStat>
                        <S.FriendshipStat>
                          <BattleIcon />
                          {friend.battlesWithFriend} battles
                        </S.FriendshipStat>
                      </S.FriendshipStats>
                    </S.FriendInfo>
                    <S.ActionButton
                      $variant="danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmRemove(friend);
                      }}
                      title="Remove friend"
                    >
                      <DeleteIcon />
                    </S.ActionButton>
                  </S.FriendCard>
                ))}
              </S.FriendsList>
            )}
          </S.Section>
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <>
            {/* Received Requests */}
            <S.Section>
              <S.SectionTitle>
                <RequestIcon />
                Received Requests ({receivedRequests.length})
              </S.SectionTitle>

              {receivedRequests.length === 0 ? (
                <S.EmptyState>
                  <RequestIcon />
                  <h3>No pending requests</h3>
                  <p>Friend requests you receive will appear here.</p>
                </S.EmptyState>
              ) : (
                <S.FriendsList>
                  {receivedRequests.map((request) => (
                    <S.RequestCard key={request.requestId}>
                      <S.FriendAvatar>
                        {request.avatarUrl ? (
                          <img src={request.avatarUrl} alt={request.username} />
                        ) : (
                          request.username.charAt(0).toUpperCase()
                        )}
                      </S.FriendAvatar>
                      <S.FriendInfo>
                        <S.FriendName>
                          {request.username}
                          <S.LevelBadge>Lv.{request.trainerLevel}</S.LevelBadge>
                        </S.FriendName>
                        <S.FriendDetails>
                          Sent {getTimeAgo(request.sentAt)}
                        </S.FriendDetails>
                      </S.FriendInfo>
                      {request.message && (
                        <S.RequestMessage>"{request.message}"</S.RequestMessage>
                      )}
                      <S.RequestActions>
                        <S.ActionButton
                          $variant="primary"
                          onClick={() => acceptRequest(request.requestId)}
                        >
                          <CheckIcon />
                          Accept
                        </S.ActionButton>
                        <S.ActionButton
                          onClick={() => declineRequest(request.requestId)}
                        >
                          <XIcon />
                          Decline
                        </S.ActionButton>
                      </S.RequestActions>
                    </S.RequestCard>
                  ))}
                </S.FriendsList>
              )}
            </S.Section>

            {/* Sent Requests */}
            <S.Section>
              <S.SectionTitle>
                Sent Requests ({sentRequests.length})
              </S.SectionTitle>

              {sentRequests.length === 0 ? (
                <S.EmptyState>
                  <p>Requests you send will appear here.</p>
                </S.EmptyState>
              ) : (
                <S.FriendsList>
                  {sentRequests.map((request) => (
                    <S.RequestCard key={request.requestId}>
                      <S.FriendAvatar>
                        {request.avatarUrl ? (
                          <img src={request.avatarUrl} alt={request.username} />
                        ) : (
                          request.username.charAt(0).toUpperCase()
                        )}
                      </S.FriendAvatar>
                      <S.FriendInfo>
                        <S.FriendName>
                          {request.username}
                          <S.LevelBadge>Lv.{request.trainerLevel}</S.LevelBadge>
                        </S.FriendName>
                        <S.FriendDetails>
                          Sent {getTimeAgo(request.sentAt)} • Pending
                        </S.FriendDetails>
                      </S.FriendInfo>
                      <S.ActionButton
                        onClick={() => cancelRequest(request.requestId)}
                      >
                        <XIcon />
                        Cancel
                      </S.ActionButton>
                    </S.RequestCard>
                  ))}
                </S.FriendsList>
              )}
            </S.Section>
          </>
        )}

        {/* Add Friend Tab */}
        {activeTab === "add" && (
          <>
            {/* My Friend Code */}
            <S.FriendCodeSection>
              <S.SectionTitle>
                <QRIcon />
                My Friend Code
              </S.SectionTitle>

              <S.FriendCodeDisplay>
                <S.FriendCodeLabel>Share this code with friends</S.FriendCodeLabel>
                <S.FriendCode>{friendCode?.friendCode || "--------------"}</S.FriendCode>
              </S.FriendCodeDisplay>

              {qrCodeDataUrl && (
                <S.QRCodeWrapper>
                  <img
                    src={qrCodeDataUrl}
                    alt="Friend Code QR"
                    style={{ width: 180, height: 180 }}
                  />
                </S.QRCodeWrapper>
              )}

              <S.ButtonGroup>
                <S.ActionButton onClick={copyFriendCode}>
                  <CopyIcon />
                  Copy Code
                </S.ActionButton>
                <S.ActionButton onClick={regenerateCode}>
                  <RefreshIcon />
                  New Code
                </S.ActionButton>
              </S.ButtonGroup>
            </S.FriendCodeSection>

            {/* Add by Code */}
            <S.Section>
              <S.SectionTitle>Add Friend by Code</S.SectionTitle>

              <S.AddFriendInput>
                <input
                  type="text"
                  placeholder="Enter friend code (XXXX-XXXX-XXXX)"
                  value={inputCode}
                  onChange={handleCodeInput}
                  maxLength={14}
                />
                <S.ActionButton
                  $variant="primary"
                  onClick={sendFriendRequest}
                  disabled={inputCode.length !== 14}
                >
                  <AddIcon />
                  Add
                </S.ActionButton>
              </S.AddFriendInput>
            </S.Section>

            {/* QR Scanner placeholder */}
            <S.Section>
              <S.SectionTitle>
                <QRIcon />
                Scan QR Code
              </S.SectionTitle>
              <S.EmptyState>
                <QRIcon />
                <h3>QR Scanner</h3>
                <p>Scan a friend's QR code to add them instantly.</p>
                <S.ActionButton
                  $variant="primary"
                  onClick={() => setShowQRScanner(true)}
                  style={{ marginTop: "16px" }}
                >
                  <QRIcon />
                  Open Scanner
                </S.ActionButton>
              </S.EmptyState>
            </S.Section>
          </>
        )}
      </S.ContentWrapper>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <S.ScannerOverlay>
          <S.ScannerFrame>
            {/* Camera feed would go here */}
          </S.ScannerFrame>
          <S.ScannerText>
            Point your camera at a friend's QR code
          </S.ScannerText>
          <S.ActionButton onClick={() => setShowQRScanner(false)}>
            <XIcon />
            Close Scanner
          </S.ActionButton>
        </S.ScannerOverlay>
      )}

      {/* Remove Friend Confirmation */}
      {confirmRemove && (
        <S.ConfirmModal>
          <S.ConfirmContent>
            <S.ConfirmTitle>Remove Friend?</S.ConfirmTitle>
            <S.ConfirmText>
              Are you sure you want to remove{" "}
              <strong>{confirmRemove.username}</strong> from your friends list?
            </S.ConfirmText>
            <S.ButtonGroup>
              <S.ActionButton onClick={() => setConfirmRemove(null)}>
                Cancel
              </S.ActionButton>
              <S.ActionButton $variant="danger" onClick={removeFriend}>
                <DeleteIcon />
                Remove
              </S.ActionButton>
            </S.ButtonGroup>
          </S.ConfirmContent>
        </S.ConfirmModal>
      )}

      <Navbar />
    </S.Container>
  );
};

export default FriendsPage;
