import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Header,
  Loading,
  Modal,
  Button,
  Text,
  Navbar,
} from "../../components/ui";
import { useDebounce } from "../../components/hooks";
import { useAuth } from "../../contexts/AuthContext";
import { friendService } from "../../services";
import { presenceHub } from "../../services/signalr/presence.hub";
import { FriendDto, FriendsSummaryDto } from "../../types/friend.types";
import * as S from "./index.style";
import {
  BattleIcon,
  CloseIcon,
  DeleteIcon,
  FriendsIcon,
  GiftIcon,
  MessageIcon,
  SearchIcon,
  TradeIcon,
  ViewPokemonIcon,
} from "./icons";

interface FriendPokemon {
  id: number;
  pokemonId: number;
  name: string;
  sprite: string;
  nickname?: string;
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isInitialized } = useAuth();

  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<FriendDto[]>([]);
  const [summary, setSummary] = useState<FriendsSummaryDto | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedFriend, setSelectedFriend] = useState<FriendDto | null>(null);
  const [confirmRemove, setConfirmRemove] = useState<FriendDto | null>(null);
  const [showGiftModal, setShowGiftModal] = useState<FriendDto | null>(null);
  const [showPokemonModal, setShowPokemonModal] = useState<FriendDto | null>(
    null,
  );
  const [friendPokemon, setFriendPokemon] = useState<FriendPokemon[]>([]);
  const [loadingPokemon, setLoadingPokemon] = useState(false);

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [friendsData, summaryData] = await Promise.all([
        friendService.getFriends(),
        friendService.getFriendsSummary(),
      ]);
      setFriends(friendsData);
      setSummary(summaryData);
    } catch (error) {
      console.error("Failed to load friends data:", error);
      toast.error("Failed to load friends data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    if (isAuthenticated) {
      loadData();

      // Subscribe to events FIRST to avoid missing messages
      const unsubOnline = presenceHub.onUserOnline((userId) => {
        setFriends((prev) =>
          prev.map((f) => (f.userId === userId ? { ...f, isOnline: true } : f)),
        );
        setSummary((prev) =>
          prev ? { ...prev, onlineFriends: prev.onlineFriends + 1 } : null,
        );
      });

      const unsubOffline = presenceHub.onUserOffline((userId) => {
        setFriends((prev) =>
          prev.map((f) =>
            f.userId === userId ? { ...f, isOnline: false } : f,
          ),
        );
        setSummary((prev) =>
          prev
            ? { ...prev, onlineFriends: Math.max(0, prev.onlineFriends - 1) }
            : null,
        );
      });

      // Start SignalR connection and fetch initial state LAST
      const initSignalR = async () => {
        await presenceHub.start();
        const onlineIds = await presenceHub.getOnlineFriends();

        if (onlineIds && onlineIds.length > 0) {
          setFriends((prev) =>
            prev.map((f) => {
              const isOnline = onlineIds.includes(f.userId);
              return { ...f, isOnline };
            }),
          );

          // Recalculate summary if needed, but summary endpoint might already have it?
          // Summary endpoint comes from HTTP API, which might rely on DB LastActive or similar,
          // but PresenceTracker is in-memory.
          // So we should rely on the SignalR result for the most accurate "Online Now" count.
          setSummary((prev) => {
            if (!prev) return null;
            return { ...prev, onlineFriends: onlineIds.length };
          });
        }
      };

      initSignalR();

      return () => {
        unsubOnline();
        unsubOffline();
        presenceHub.stop();
      };
    }
  }, [isAuthenticated, isInitialized, navigate, loadData]);

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

  const sendGift = async (friend: FriendDto) => {
    // TODO: Implement gift sending API
    toast.success(`Gift sent to ${friend.username}! 🎁`);
    setShowGiftModal(null);
  };

  const viewFriendPokemon = async (friend: FriendDto) => {
    setShowPokemonModal(friend);
    setLoadingPokemon(true);
    try {
      // TODO: Replace with actual API call to get friend's Pokemon
      // Mock data for now
      const mockPokemon: FriendPokemon[] = [
        {
          id: 1,
          pokemonId: 25,
          name: "Pikachu",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
          nickname: "Sparky",
        },
        {
          id: 2,
          pokemonId: 6,
          name: "Charizard",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
          nickname: "Blaze",
        },
        {
          id: 3,
          pokemonId: 9,
          name: "Blastoise",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png",
        },
        {
          id: 4,
          pokemonId: 150,
          name: "Mewtwo",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png",
        },
        {
          id: 5,
          pokemonId: 143,
          name: "Snorlax",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png",
          nickname: "Big Boy",
        },
        {
          id: 6,
          pokemonId: 131,
          name: "Lapras",
          sprite:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/131.png",
        },
      ];
      setFriendPokemon(mockPokemon);
    } catch (error) {
      toast.error("Failed to load friend's Pokemon");
    } finally {
      setLoadingPokemon(false);
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

  // Filter friends by debounced search
  const filteredFriends = friends.filter(
    (friend) =>
      friend.username
        .toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()) ||
      friend.nickname
        ?.toLowerCase()
        .includes(debouncedSearchQuery.toLowerCase()),
  );

  // Separate online and offline friends
  const onlineFriends = filteredFriends.filter((f) => f.isOnline);
  const offlineFriends = filteredFriends.filter((f) => !f.isOnline);

  if (!isInitialized || loading) {
    return <Loading />;
  }

  return (
    <>
      <Header title="Pokédex" subtitle="Friends" />

      <S.PageContainer>
        {/* Stats Header */}
        <S.StatsHeader>
          <S.StatCard>
            <S.StatIcon $color="blue">
              <FriendsIcon />
            </S.StatIcon>
            <S.StatInfo>
              <S.StatValue>{summary?.totalFriends || 0}</S.StatValue>
              <S.StatLabel>Total Friends</S.StatLabel>
            </S.StatInfo>
          </S.StatCard>
          <S.StatCard>
            <S.StatIcon $color="green">
              <span style={{ fontSize: "28px", lineHeight: 1 }}>●</span>
            </S.StatIcon>
            <S.StatInfo>
              <S.StatValue>{summary?.onlineFriends || 0}</S.StatValue>
              <S.StatLabel>Online Now</S.StatLabel>
            </S.StatInfo>
          </S.StatCard>
        </S.StatsHeader>

        {/* Search Bar */}
        <S.SearchContainer>
          <SearchIcon />
          <input
            type="text"
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </S.SearchContainer>

        {/* Friends List */}
        <S.FriendsContainer>
          {friends.length === 0 ? (
            <S.EmptyState>
              <FriendsIcon />
              <h3>No friends yet</h3>
              <p>Go to your Profile to add friends using friend codes!</p>
              <S.AddFriendButton onClick={() => navigate("/profile")}>
                Add Friends
              </S.AddFriendButton>
            </S.EmptyState>
          ) : filteredFriends.length === 0 ? (
            <S.EmptyState>
              <SearchIcon />
              <h3>No friends found</h3>
              <p>Try a different search term</p>
            </S.EmptyState>
          ) : (
            <>
              {/* Online Friends */}
              {onlineFriends.length > 0 && (
                <S.FriendSection>
                  <S.SectionTitle>
                    <span className="online-dot">●</span>
                    Online ({onlineFriends.length})
                  </S.SectionTitle>
                  <S.FriendsGrid>
                    {onlineFriends.map((friend) => (
                      <S.FriendCard
                        key={friend.userId}
                        $online={true}
                        onClick={() => setSelectedFriend(friend)}
                      >
                        <S.FriendAvatar $online={true}>
                          {friend.avatarUrl ? (
                            <img src={friend.avatarUrl} alt={friend.username} />
                          ) : (
                            friend.username.charAt(0).toUpperCase()
                          )}
                        </S.FriendAvatar>
                        <S.FriendName>
                          {friend.nickname || friend.username}
                        </S.FriendName>
                        <S.FriendLevel>Lv.{friend.trainerLevel}</S.FriendLevel>
                        <S.FriendStatus $online={true}>Online</S.FriendStatus>
                        <S.QuickActions>
                          <S.QuickActionBtn
                            title="Send Gift"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowGiftModal(friend);
                            }}
                          >
                            <GiftIcon />
                          </S.QuickActionBtn>
                          <S.QuickActionBtn
                            title="View Pokemon"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewFriendPokemon(friend);
                            }}
                          >
                            <ViewPokemonIcon />
                          </S.QuickActionBtn>
                          <S.QuickActionBtn
                            title="Battle"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast("Battle feature coming soon! ⚔️");
                            }}
                          >
                            <BattleIcon />
                          </S.QuickActionBtn>
                        </S.QuickActions>
                      </S.FriendCard>
                    ))}
                  </S.FriendsGrid>
                </S.FriendSection>
              )}

              {/* Offline Friends */}
              {offlineFriends.length > 0 && (
                <S.FriendSection>
                  <S.SectionTitle>
                    Offline ({offlineFriends.length})
                  </S.SectionTitle>
                  <S.FriendsGrid>
                    {offlineFriends.map((friend) => (
                      <S.FriendCard
                        key={friend.userId}
                        $online={false}
                        onClick={() => setSelectedFriend(friend)}
                      >
                        <S.FriendAvatar $online={false}>
                          {friend.avatarUrl ? (
                            <img src={friend.avatarUrl} alt={friend.username} />
                          ) : (
                            friend.username.charAt(0).toUpperCase()
                          )}
                        </S.FriendAvatar>
                        <S.FriendName>
                          {friend.nickname || friend.username}
                        </S.FriendName>
                        <S.FriendLevel>Lv.{friend.trainerLevel}</S.FriendLevel>
                        <S.FriendStatus $online={false}>
                          {getTimeAgo(friend.lastActiveDate)}
                        </S.FriendStatus>
                        <S.QuickActions>
                          <S.QuickActionBtn
                            title="Send Gift"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowGiftModal(friend);
                            }}
                          >
                            <GiftIcon />
                          </S.QuickActionBtn>
                          <S.QuickActionBtn
                            title="View Pokemon"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewFriendPokemon(friend);
                            }}
                          >
                            <ViewPokemonIcon />
                          </S.QuickActionBtn>
                        </S.QuickActions>
                      </S.FriendCard>
                    ))}
                  </S.FriendsGrid>
                </S.FriendSection>
              )}
            </>
          )}
        </S.FriendsContainer>
      </S.PageContainer>

      {/* Friend Detail Modal */}
      {selectedFriend && (
        <S.ModalOverlay onClick={() => setSelectedFriend(null)}>
          <S.FriendDetailModal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalClose onClick={() => setSelectedFriend(null)}>
                <CloseIcon />
              </S.ModalClose>
            </S.ModalHeader>

            <S.FriendDetailAvatar $online={selectedFriend.isOnline}>
              {selectedFriend.avatarUrl ? (
                <img
                  src={selectedFriend.avatarUrl}
                  alt={selectedFriend.username}
                />
              ) : (
                selectedFriend.username.charAt(0).toUpperCase()
              )}
            </S.FriendDetailAvatar>

            <S.FriendDetailName>
              {selectedFriend.nickname || selectedFriend.username}
              {selectedFriend.nickname && (
                <span className="username">@{selectedFriend.username}</span>
              )}
            </S.FriendDetailName>

            <S.FriendDetailLevel>
              Level {selectedFriend.trainerLevel} Trainer
            </S.FriendDetailLevel>

            <S.FriendDetailStatus $online={selectedFriend.isOnline}>
              {selectedFriend.isOnline
                ? "● Online"
                : `Last seen ${getTimeAgo(selectedFriend.lastActiveDate)}`}
            </S.FriendDetailStatus>

            <S.FriendDetailStats>
              <S.DetailStat>
                <span className="value">{selectedFriend.friendshipLevel}</span>
                <span className="label">Friendship</span>
              </S.DetailStat>
              <S.DetailStat>
                <span className="value">{selectedFriend.tradesWithFriend}</span>
                <span className="label">Trades</span>
              </S.DetailStat>
              <S.DetailStat>
                <span className="value">
                  {selectedFriend.battlesWithFriend}
                </span>
                <span className="label">Battles</span>
              </S.DetailStat>
            </S.FriendDetailStats>

            <S.FriendDetailInfo>
              Friends since {formatDate(selectedFriend.friendsSince)}
            </S.FriendDetailInfo>

            <S.FriendDetailActions>
              <S.ActionButton
                $variant="primary"
                onClick={() => {
                  const friend = selectedFriend;
                  setSelectedFriend(null);
                  setShowGiftModal(friend);
                }}
              >
                <GiftIcon /> Send Gift
              </S.ActionButton>
              <S.ActionButton
                onClick={() => {
                  const friend = selectedFriend;
                  setSelectedFriend(null);
                  viewFriendPokemon(friend);
                }}
              >
                <ViewPokemonIcon /> View Pokémon
              </S.ActionButton>
              <S.ActionButton
                onClick={() => toast("Trade feature coming soon! 🔄")}
              >
                <TradeIcon /> Trade
              </S.ActionButton>
              <S.ActionButton
                onClick={() => toast("Battle feature coming soon! ⚔️")}
              >
                <BattleIcon /> Battle
              </S.ActionButton>
              <S.ActionButton
                onClick={() => toast("Message feature coming soon! 💬")}
              >
                <MessageIcon /> Message
              </S.ActionButton>
              <S.ActionButton
                $variant="danger"
                onClick={() => {
                  const friend = selectedFriend;
                  setSelectedFriend(null);
                  setConfirmRemove(friend);
                }}
              >
                <DeleteIcon /> Remove Friend
              </S.ActionButton>
            </S.FriendDetailActions>
          </S.FriendDetailModal>
        </S.ModalOverlay>
      )}

      {/* Gift Modal */}
      {showGiftModal && (
        <S.ModalOverlay onClick={() => setShowGiftModal(null)}>
          <S.GiftModal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h3>Send Gift to {showGiftModal.username}</h3>
              <S.ModalClose onClick={() => setShowGiftModal(null)}>
                <CloseIcon />
              </S.ModalClose>
            </S.ModalHeader>

            <S.GiftGrid>
              <S.GiftItem onClick={() => sendGift(showGiftModal)}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"
                  alt="Poké Ball"
                />
                <span>Poké Ball</span>
                <span className="quantity">x5</span>
              </S.GiftItem>
              <S.GiftItem onClick={() => sendGift(showGiftModal)}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png"
                  alt="Great Ball"
                />
                <span>Great Ball</span>
                <span className="quantity">x3</span>
              </S.GiftItem>
              <S.GiftItem onClick={() => sendGift(showGiftModal)}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png"
                  alt="Ultra Ball"
                />
                <span>Ultra Ball</span>
                <span className="quantity">x1</span>
              </S.GiftItem>
              <S.GiftItem onClick={() => sendGift(showGiftModal)}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/potion.png"
                  alt="Potion"
                />
                <span>Potion</span>
                <span className="quantity">x10</span>
              </S.GiftItem>
              <S.GiftItem onClick={() => sendGift(showGiftModal)}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/revive.png"
                  alt="Revive"
                />
                <span>Revive</span>
                <span className="quantity">x2</span>
              </S.GiftItem>
              <S.GiftItem onClick={() => sendGift(showGiftModal)}>
                <img
                  src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/rare-candy.png"
                  alt="Rare Candy"
                />
                <span>Rare Candy</span>
                <span className="quantity">x1</span>
              </S.GiftItem>
            </S.GiftGrid>
          </S.GiftModal>
        </S.ModalOverlay>
      )}

      {/* View Pokemon Modal */}
      {showPokemonModal && (
        <S.ModalOverlay onClick={() => setShowPokemonModal(null)}>
          <S.PokemonModal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <h3>{showPokemonModal.username}'s Pokémon</h3>
              <S.ModalClose onClick={() => setShowPokemonModal(null)}>
                <CloseIcon />
              </S.ModalClose>
            </S.ModalHeader>

            {loadingPokemon ? (
              <S.LoadingPokemon>
                <Loading />
                <p>Loading Pokémon...</p>
              </S.LoadingPokemon>
            ) : friendPokemon.length === 0 ? (
              <S.EmptyPokemon>
                <ViewPokemonIcon />
                <p>No Pokémon to display</p>
              </S.EmptyPokemon>
            ) : (
              <S.PokemonGrid>
                {friendPokemon.map((pokemon) => (
                  <S.PokemonCard key={pokemon.id}>
                    <img src={pokemon.sprite} alt={pokemon.name} />
                    <span className="name">
                      {pokemon.nickname || pokemon.name}
                    </span>
                    {pokemon.nickname && (
                      <span className="species">{pokemon.name}</span>
                    )}
                  </S.PokemonCard>
                ))}
              </S.PokemonGrid>
            )}
          </S.PokemonModal>
        </S.ModalOverlay>
      )}

      {/* Remove Friend Confirmation */}
      <Modal open={!!confirmRemove} overlay="light">
        <S.ConfirmModal>
          <Text>
            Are you sure you want to remove{" "}
            <strong>{confirmRemove?.username}</strong> from your friends list?
          </Text>
          <S.ConfirmButtons>
            <Button variant="light" onClick={removeFriend}>
              Remove
            </Button>
            <Button onClick={() => setConfirmRemove(null)}>Cancel</Button>
          </S.ConfirmButtons>
        </S.ConfirmModal>
      </Modal>

      <Navbar />
    </>
  );
};

export default FriendsPage;
