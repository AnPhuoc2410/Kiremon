import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Header,
  Loading,
  PokeCard,
  DeleteButton,
  Modal,
  Button,
  Text,
  AvatarChangeModal,
} from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import { useGlobalContext } from "../../contexts";
import { userService, UserProfile } from "../../services/user/user.service";
import { IMyPokemon } from "../../types/pokemon";
import {
  generatePokeSummary,
  loadMyPokemonFromLocalStorage,
} from "../../helpers";
import * as S from "./index.style";
import toast from "react-hot-toast";

// Tab types
type TabType = "profile" | "my-pokemon";

// Icons
const ProfileIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
      fill="currentColor"
    />
    <path
      d="M10 11.6667C5.8325 11.6667 2.5 14.1083 2.5 17.0833C2.5 17.775 3.05833 18.3333 3.75 18.3333H16.25C16.9417 18.3333 17.5 17.775 17.5 17.0833C17.5 14.1083 14.1675 11.6667 10 11.6667Z"
      fill="currentColor"
    />
  </svg>
);

const PokeballIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path d="M2 12h7a3 3 0 0 0 6 0h7" stroke="currentColor" strokeWidth="2" />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M16.1667 10C16.1667 9.50833 16.125 9.025 16.0417 8.55833L17.8333 7.15833C18.0833 6.96667 18.15 6.61667 17.9917 6.34167L16.325 3.49167C16.1667 3.21667 15.8333 3.10833 15.5417 3.21667L13.4583 4.075C12.875 3.625 12.2417 3.25 11.5417 2.975L11.2083 0.75C11.1583 0.433333 10.8833 0.166667 10.5417 0.166667H7.20833C6.86667 0.166667 6.59167 0.433333 6.54167 0.75L6.20833 2.975C5.50833 3.25 4.875 3.63333 4.29167 4.075L2.20833 3.21667C1.91667 3.10833 1.58333 3.225 1.425 3.49167L-0.241667 6.34167C-0.4 6.61667 -0.333333 6.96667 -0.0833333 7.15833L1.70833 8.55833C1.625 9.025 1.58333 9.51667 1.58333 10C1.58333 10.4833 1.625 10.975 1.70833 11.4417L-0.0833333 12.8417C-0.333333 13.0333 -0.4 13.3833 -0.241667 13.6583L1.425 16.5083C1.58333 16.7833 1.91667 16.8917 2.20833 16.7833L4.29167 15.925C4.875 16.375 5.50833 16.75 6.20833 17.025L6.54167 19.25C6.59167 19.5667 6.86667 19.8333 7.20833 19.8333H10.5417C10.8833 19.8333 11.1583 19.5667 11.2083 19.25L11.5417 17.025C12.2417 16.75 12.875 16.3667 13.4583 15.925L15.5417 16.7833C15.8333 16.8917 16.1667 16.775 16.325 16.5083L17.9917 13.6583C18.15 13.3833 18.0833 13.0333 17.8333 12.8417L16.0417 11.4417C16.125 10.975 16.1667 10.4917 16.1667 10Z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13.3333 14.1667L17.5 10L13.3333 5.83333"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 10H7.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V4C14 3.26362 13.403 2.66667 12.6667 2.66667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 1.33333V4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33333 1.33333V4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 6.66667H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 0L9.79611 5.52786H15.6085L10.9062 8.94427L12.7023 14.4721L8 11.0557L3.29772 14.4721L5.09383 8.94427L0.391548 5.52786H6.20389L8 0Z" />
  </svg>
);

const TrophyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 1.33333H12V5.33333C12 7.54247 10.2091 9.33333 8 9.33333C5.79086 9.33333 4 7.54247 4 5.33333V1.33333Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4 2.66667H2V4.66667C2 5.77124 2.89543 6.66667 4 6.66667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 2.66667H14V4.66667C14 5.77124 13.1046 6.66667 12 6.66667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path d="M8 9.33333V12" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5.33333 14.6667H10.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M5.33333 12H10.6667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.3333 2.00001C11.5083 1.82491 11.7163 1.68602 11.9451 1.59126C12.1739 1.4965 12.4192 1.44772 12.6667 1.44772C12.9141 1.44772 13.1594 1.4965 13.3882 1.59126C13.617 1.68602 13.825 1.82491 14 2.00001C14.1751 2.1751 14.314 2.38311 14.4087 2.61189C14.5035 2.84067 14.5523 3.08598 14.5523 3.33334C14.5523 3.5807 14.5035 3.82601 14.4087 4.05479C14.314 4.28357 14.1751 4.49158 14 4.66667L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00001Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CameraIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.3333 12.6667C15.3333 13.0203 15.1929 13.3594 14.9428 13.6095C14.6928 13.8595 14.3536 14 14 14H2C1.64638 14 1.30724 13.8595 1.05719 13.6095C0.807143 13.3594 0.666667 13.0203 0.666667 12.6667V5.33333C0.666667 4.97971 0.807143 4.64057 1.05719 4.39052C1.30724 4.14048 1.64638 4 2 4H4.66667L6 2H10L11.3333 4H14C14.3536 4 14.6928 4.14048 14.9428 4.39052C15.1929 4.64057 15.3333 4.97971 15.3333 5.33333V12.6667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 11.3333C9.47276 11.3333 10.6667 10.1394 10.6667 8.66667C10.6667 7.19391 9.47276 6 8 6C6.52724 6 5.33333 7.19391 5.33333 8.66667C5.33333 10.1394 6.52724 11.3333 8 11.3333Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Helper functions
const calculateLevelProgress = (experience: number, level: number): number => {
  const xpForCurrentLevel = level * 100;
  const xpForNextLevel = (level + 1) * 100;
  const xpInCurrentLevel = experience - level * (level - 1) * 50;
  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeeded) * 100));
};

const getTrainerTitle = (level: number): string => {
  if (level >= 50) return "Pokémon Master";
  if (level >= 40) return "Elite Trainer";
  if (level >= 30) return "Veteran Trainer";
  if (level >= 20) return "Experienced Trainer";
  if (level >= 10) return "Rising Trainer";
  if (level >= 5) return "Rookie Trainer";
  return "Beginner Trainer";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    isInitialized,
    user: authUser,
    authLogout,
    updateUser,
  } = useAuth();
  const { setState } = useGlobalContext();

  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // My Pokemon state
  const [pokemons, setPokemons] = useState<IMyPokemon[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState("");

  // Avatar change modal state
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  // Edit profile state
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
  });

  useEffect(() => {
    if (isInitialized && !isAuthenticated) {
      toast.error("Please login to view your profile");
      navigate("/login");
      return;
    }

    if (isInitialized && isAuthenticated) {
      fetchProfile();
      loadMyPokemon();
    }
  }, [isInitialized, isAuthenticated, navigate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;

      // Ctrl+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!isUpdatingProfile) {
          handleEditProfile();
        }
      }

      // Esc to cancel
      if (e.key === "Escape") {
        e.preventDefault();
        if (!isUpdatingProfile) {
          handleCancelEdit();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditMode, isUpdatingProfile, editFormData]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getProfile();
      setProfile(data);
      // Initialize edit form data
      setEditFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      console.error("Failed to fetch profile:", err);
      setError(error.response?.data?.message || "Failed to load profile data");
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadMyPokemon = () => {
    const parsed = loadMyPokemonFromLocalStorage();
    setPokemons(parsed);
  };

  const releasePokemon = (nickname: string) => {
    const newCollection = pokemons.filter(
      (pokemon: IMyPokemon) => pokemon.nickname !== nickname,
    );
    localStorage.setItem("pokegames@myPokemon", JSON.stringify(newCollection));
    loadMyPokemon();
    setState({ pokeSummary: generatePokeSummary(newCollection) });
  };

  const handleAvatarChange = async (avatarUrl: string) => {
    try {
      setIsUpdatingAvatar(true);
      await userService.updateProfile({ avatarUrl });

      // Update local profile state
      setProfile((prev) => (prev ? { ...prev, avatarUrl } : null));

      // Update AuthContext to sync avatar across all components
      updateUser({ avatarUrl });

      toast.success("Avatar updated successfully!");
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Failed to update avatar:", error);
      toast.error("Failed to update avatar. Please try again.");
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleEditProfile = async () => {
    try {
      setIsUpdatingProfile(true);

      // Validate form
      if (!editFormData.firstName?.trim() && !editFormData.lastName?.trim()) {
        toast.error("Please enter at least first name or last name");
        return;
      }

      await userService.updateProfile({
        firstName: editFormData.firstName?.trim() || null,
        lastName: editFormData.lastName?.trim() || null,
      });

      // Update local profile state
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              firstName: editFormData.firstName?.trim() || null,
              lastName: editFormData.lastName?.trim() || null,
            }
          : null,
      );

      // Update AuthContext
      updateUser({
        firstName: editFormData.firstName?.trim() || null,
        lastName: editFormData.lastName?.trim() || null,
      });

      setIsEditMode(false);
      toast.success("Profile updated successfully!");
      await fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to current profile values
    setEditFormData({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
    });
    setIsEditMode(false);
  };

  // Get display data
  const displayName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile?.username || authUser?.username || "Trainer";

  const avatarUrl =
    profile?.avatarUrl ||
    authUser?.avatarUrl ||
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

  const level = profile?.level || authUser?.level || 1;
  const pokemonCaught = profile?.pokemonCaught || authUser?.pokemonCaught || 0;
  const experience = profile?.experience || 0;

  if (!isInitialized) {
    return (
      <>
        <Header title="Pokédex" subtitle="Profile" />
        <S.Page>
          <S.LayoutContainer>
            <S.MainContent>
              <S.LoadingContainer>
                <Loading />
                <S.LoadingText>Initializing...</S.LoadingText>
              </S.LoadingContainer>
            </S.MainContent>
          </S.LayoutContainer>
        </S.Page>
      </>
    );
  }

  return (
    <>
      <Header title="Pokédex" subtitle="Trainer Profile" />

      {/* Delete Confirmation Modal */}
      <Modal open={deleteConfirmation} overlay="light">
        <S.DeleteConfirmationModal>
          <div style={{ textAlign: "left" }}>
            <Text>Are you sure you want to release {selectedPokemon}?</Text>
            <br />
            <Text>
              You'll have to catch another one and cannot undo this action.
            </Text>
          </div>
          <div className="modal-buttons">
            <Button
              variant="light"
              onClick={() => {
                releasePokemon(selectedPokemon);
                setDeleteConfirmation(false);
              }}
            >
              Release
            </Button>
            <Button onClick={() => setDeleteConfirmation(false)}>Cancel</Button>
          </div>
        </S.DeleteConfirmationModal>
      </Modal>

      <S.Page>
        <S.LayoutContainer>
          {/* Sidebar */}
          <S.Sidebar>
            <S.SidebarHeader>
              <S.SidebarAvatarWrapper>
                <S.SidebarAvatar onClick={() => setIsAvatarModalOpen(true)}>
                  <img src={avatarUrl} alt={`${displayName}'s avatar`} />
                </S.SidebarAvatar>
                <S.SidebarLevelBadge>Lv.{level}</S.SidebarLevelBadge>
                <S.SidebarAvatarEdit onClick={() => setIsAvatarModalOpen(true)}>
                  <CameraIcon />
                </S.SidebarAvatarEdit>
              </S.SidebarAvatarWrapper>
              <S.SidebarUserInfo>
                <S.SidebarUsername>{displayName}</S.SidebarUsername>
                <S.SidebarTitle>{getTrainerTitle(level)}</S.SidebarTitle>
              </S.SidebarUserInfo>
            </S.SidebarHeader>

            <S.SidebarNav>
              <S.SidebarNavItem
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              >
                <ProfileIcon />
                Profile
              </S.SidebarNavItem>
              <S.SidebarNavItem
                active={activeTab === "my-pokemon"}
                onClick={() => setActiveTab("my-pokemon")}
              >
                <PokeballIcon />
                My Pokémon
              </S.SidebarNavItem>
            </S.SidebarNav>

            <S.SidebarDivider />

            <S.SidebarNav>
              <S.SidebarNavItem onClick={() => navigate("/settings")}>
                <SettingsIcon />
                Settings
              </S.SidebarNavItem>
              <S.SidebarNavItem onClick={() => authLogout()}>
                <LogoutIcon />
                Logout
              </S.SidebarNavItem>
            </S.SidebarNav>

            <S.SidebarStats>
              <S.SidebarStatItem>
                <S.SidebarStatLabel>Level</S.SidebarStatLabel>
                <S.SidebarStatValue>{level}</S.SidebarStatValue>
              </S.SidebarStatItem>
              <S.SidebarStatItem>
                <S.SidebarStatLabel>Pokémon</S.SidebarStatLabel>
                <S.SidebarStatValue>{pokemonCaught}</S.SidebarStatValue>
              </S.SidebarStatItem>
              <S.SidebarStatItem>
                <S.SidebarStatLabel>XP</S.SidebarStatLabel>
                <S.SidebarStatValue>{experience}</S.SidebarStatValue>
              </S.SidebarStatItem>
            </S.SidebarStats>
          </S.Sidebar>

          {/* Main Content */}
          <S.MainContent>
            {activeTab === "profile" && (
              <>
                <S.ContentHeader>
                  <S.ContentTitle>Profile Overview</S.ContentTitle>
                </S.ContentHeader>

                {loading ? (
                  <S.LoadingContainer>
                    <Loading />
                    <S.LoadingText>Loading profile...</S.LoadingText>
                  </S.LoadingContainer>
                ) : error ? (
                  <S.ProfileCard>
                    <S.ErrorContainer>
                      <S.ErrorText>{error}</S.ErrorText>
                      <S.Button onClick={fetchProfile}>Try Again</S.Button>
                    </S.ErrorContainer>
                  </S.ProfileCard>
                ) : (
                  <>
                    {/* Stats Card */}
                    <S.ProfileCard>
                      <S.ProfileSection>
                        <S.SectionTitle>Trainer Stats</S.SectionTitle>
                        <S.StatsGrid>
                          <S.StatCard color="#FEF3C7">
                            <S.StatValue textColor="#B45309">
                              {level}
                            </S.StatValue>
                            <S.StatLabel textColor="#92400E">Level</S.StatLabel>
                          </S.StatCard>
                          <S.StatCard color="#DBEAFE">
                            <S.StatValue textColor="#1D4ED8">
                              {pokemonCaught}
                            </S.StatValue>
                            <S.StatLabel textColor="#1E40AF">
                              Caught
                            </S.StatLabel>
                          </S.StatCard>
                          <S.StatCard color="#D1FAE5">
                            <S.StatValue textColor="#047857">
                              {experience}
                            </S.StatValue>
                            <S.StatLabel textColor="#065F46">
                              Total XP
                            </S.StatLabel>
                          </S.StatCard>
                        </S.StatsGrid>

                        <S.ExperienceSection>
                          <S.ExperienceHeader>
                            <S.ExperienceLabel>
                              Experience Progress
                            </S.ExperienceLabel>
                            <S.ExperienceValue>
                              {Math.round(
                                calculateLevelProgress(experience, level),
                              )}
                              % to Level {level + 1}
                            </S.ExperienceValue>
                          </S.ExperienceHeader>
                          <S.ExperienceBar>
                            <S.ExperienceFill
                              percentage={calculateLevelProgress(
                                experience,
                                level,
                              )}
                            />
                          </S.ExperienceBar>
                        </S.ExperienceSection>
                      </S.ProfileSection>
                    </S.ProfileCard>

                    {/* Achievements Card */}
                    <S.ProfileCard>
                      <S.ProfileSection>
                        <S.SectionTitle>Achievements</S.SectionTitle>
                        <S.AchievementBadges>
                          {pokemonCaught >= 10 ? (
                            <S.Badge bgColor="#E0E7FF" textColor="#4338CA">
                              <PokeballIcon />
                              Collector
                            </S.Badge>
                          ) : (
                            <S.Badge bgColor="#F3F4F6" textColor="#9CA3AF">
                              <PokeballIcon />
                              Catch 10 Pokémon
                            </S.Badge>
                          )}
                          {level >= 10 ? (
                            <S.Badge bgColor="#FEF3C7" textColor="#B45309">
                              <StarIcon />
                              Rising Star
                            </S.Badge>
                          ) : (
                            <S.Badge bgColor="#F3F4F6" textColor="#9CA3AF">
                              <StarIcon />
                              Reach Level 10
                            </S.Badge>
                          )}
                          {pokemonCaught >= 50 ? (
                            <S.Badge bgColor="#DBEAFE" textColor="#1D4ED8">
                              <TrophyIcon />
                              Champion
                            </S.Badge>
                          ) : (
                            <S.Badge bgColor="#F3F4F6" textColor="#9CA3AF">
                              <TrophyIcon />
                              Catch 50 Pokémon
                            </S.Badge>
                          )}
                        </S.AchievementBadges>
                      </S.ProfileSection>
                    </S.ProfileCard>

                    {/* Account Info Card */}
                    <S.ProfileCard>
                      <S.ProfileSection>
                        <S.SectionTitleRow>
                          <S.SectionTitle>
                            <CalendarIcon />
                            Account Information
                          </S.SectionTitle>
                        </S.SectionTitleRow>
                        <S.InfoGrid>
                          <S.InfoItem>
                            <S.InfoLabel>Username</S.InfoLabel>
                            <S.InfoValue>
                              @{profile?.username || authUser?.username}
                            </S.InfoValue>
                          </S.InfoItem>
                          <S.InfoItem>
                            <S.InfoLabel>Email</S.InfoLabel>
                            <S.InfoValue>
                              {profile?.email || authUser?.email}
                            </S.InfoValue>
                          </S.InfoItem>
                          <S.InfoItem>
                            <S.InfoLabel>First Name</S.InfoLabel>
                            {isEditMode ? (
                              <S.InfoInput
                                type="text"
                                value={editFormData.firstName}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    firstName: e.target.value,
                                  }))
                                }
                                placeholder="Enter first name"
                                disabled={isUpdatingProfile}
                              />
                            ) : (
                              <S.InfoValue>
                                {profile?.firstName || "Not set"}
                              </S.InfoValue>
                            )}
                          </S.InfoItem>
                          <S.InfoItem>
                            <S.InfoLabel>Last Name</S.InfoLabel>
                            {isEditMode ? (
                              <S.InfoInput
                                type="text"
                                value={editFormData.lastName}
                                onChange={(e) =>
                                  setEditFormData((prev) => ({
                                    ...prev,
                                    lastName: e.target.value,
                                  }))
                                }
                                placeholder="Enter last name"
                                disabled={isUpdatingProfile}
                              />
                            ) : (
                              <S.InfoValue>
                                {profile?.lastName || "Not set"}
                              </S.InfoValue>
                            )}
                          </S.InfoItem>
                          <S.InfoItem>
                            <S.InfoLabel>Member Since</S.InfoLabel>
                            <S.InfoValue>
                              {profile?.dateJoined
                                ? formatDate(profile.dateJoined)
                                : "N/A"}
                            </S.InfoValue>
                          </S.InfoItem>
                          <S.InfoItem>
                            <S.InfoLabel>Full Name</S.InfoLabel>
                            <S.InfoValue>
                              {profile?.firstName && profile?.lastName
                                ? `${profile.firstName} ${profile.lastName}`
                                : "Not set"}
                            </S.InfoValue>
                          </S.InfoItem>
                        </S.InfoGrid>
                      </S.ProfileSection>

                      <S.ActionButtons>
                        {isEditMode ? (
                          <>
                            <S.Button
                              variant="secondary"
                              onClick={handleCancelEdit}
                              disabled={isUpdatingProfile}
                            >
                              Cancel
                            </S.Button>
                            <S.Button
                              onClick={handleEditProfile}
                              disabled={isUpdatingProfile}
                            >
                              {isUpdatingProfile ? "Saving..." : "Save Changes"}
                            </S.Button>
                          </>
                        ) : (
                          <>
                            <S.Button onClick={() => setIsEditMode(true)}>
                              <EditIcon />
                              Edit Profile
                            </S.Button>
                            <S.Button
                              variant="secondary"
                              onClick={() => setIsAvatarModalOpen(true)}
                              disabled={isUpdatingAvatar}
                            >
                              <CameraIcon />
                              {isUpdatingAvatar
                                ? "Updating..."
                                : "Change Avatar"}
                            </S.Button>
                          </>
                        )}
                      </S.ActionButtons>
                    </S.ProfileCard>
                  </>
                )}
              </>
            )}

            {activeTab === "my-pokemon" && (
              <>
                <S.ContentHeader>
                  <S.ContentTitle>My Pokémon</S.ContentTitle>
                  <S.PokemonCount>Total: {pokemons.length}</S.PokemonCount>
                </S.ContentHeader>

                {pokemons.length > 0 ? (
                  <S.PokemonGrid>
                    {[...pokemons].reverse().map((pokemon: IMyPokemon) => (
                      <S.PokemonCardWrapper key={pokemon.nickname}>
                        <PokeCard
                          name={pokemon.name}
                          nickname={pokemon.nickname}
                          sprite={pokemon.sprite}
                        >
                          <DeleteButton
                            onClick={() => {
                              setSelectedPokemon(pokemon.nickname);
                              setDeleteConfirmation(true);
                            }}
                          />
                        </PokeCard>
                      </S.PokemonCardWrapper>
                    ))}
                  </S.PokemonGrid>
                ) : (
                  <S.EmptyState>
                    <S.EmptyIcon>
                      <img src="/static/pokeball.png" alt="Pokeball" />
                    </S.EmptyIcon>
                    <S.EmptyText>
                      You haven't caught any Pokémon yet!
                    </S.EmptyText>
                    <Link to="/pokemons">
                      <S.Button>Start Exploring</S.Button>
                    </Link>
                  </S.EmptyState>
                )}
              </>
            )}
          </S.MainContent>
        </S.LayoutContainer>
      </S.Page>

      {/* Avatar Change Modal */}
      <AvatarChangeModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSelectAvatar={handleAvatarChange}
        currentAvatar={avatarUrl}
      />
    </>
  );
};

export default Profile;
