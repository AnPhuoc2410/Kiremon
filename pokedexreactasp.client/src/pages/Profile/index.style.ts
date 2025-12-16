import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { colors } from "../../components/utils";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`;

// ============ LAYOUT ============
export const Page = styled.div`
  min-height: calc(100vh - 120px);
  background: linear-gradient(
    180deg,
    ${colors["gray-100"]} 0%,
    ${colors["gray-200"]} 100%
  );
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: fixed;
    right: -150px;
    top: -50px;
    width: 400px;
    height: 400px;
    background: url("/static/pokeball-transparent.png") no-repeat center;
    background-size: contain;
    opacity: 0.05;
    z-index: 0;
    pointer-events: none;
  }
`;

export const LayoutContainer = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 120px);
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// ============ SIDEBAR ============
export const Sidebar = styled.aside`
  width: 280px;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  border-right: 1px solid ${colors["gray-200"]};
  padding: 24px 0;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid ${colors["gray-200"]};
    padding: 16px;
  }
`;

export const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid ${colors["gray-200"]};
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 768px) {
    padding: 0 0 16px;
    flex-direction: row;
    gap: 16px;
  }
`;

export const SidebarAvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

export const SidebarAvatar = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    ${colors["yellow-200"]} 0%,
    ${colors["yellow-400"]} 100%
  );
  border: 4px solid ${colors["red-500"]};
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.25);
  animation: ${float} 3s ease-in-out infinite;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(239, 68, 68, 0.35);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    image-rendering: pixelated;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

export const SidebarAvatarEdit = styled.button`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${colors["red-500"]};
  border: 3px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${colors["red-600"]};
    transform: scale(1.1);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    bottom: 0;
    right: 0;

    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const SidebarLevelBadge = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(
    135deg,
    ${colors["blue-500"]},
    ${colors["blue-700"]}
  );
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);

  @media (max-width: 768px) {
    padding: 2px 8px;
    font-size: 0.65rem;
  }
`;

export const SidebarUserInfo = styled.div`
  @media (max-width: 768px) {
    flex: 1;
  }
`;

export const SidebarUsername = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin: 0 0 2px 0;
`;

export const SidebarTitle = styled.p`
  font-size: 0.8rem;
  color: ${colors["gray-500"]};
  margin: 0;
`;

export const SidebarNav = styled.nav`
  @media (max-width: 768px) {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
  }
`;

export const SidebarNavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border: none;
  background: ${({ active }) =>
    active
      ? `linear-gradient(90deg, ${colors["red-100"]} 0%, transparent 100%)`
      : "transparent"};
  color: ${({ active }) => (active ? colors["red-600"] : colors["gray-600"])};
  font-size: 0.95rem;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border-left: 3px solid
    ${({ active }) => (active ? colors["red-500"] : "transparent")};

  &:hover {
    background: ${({ active }) =>
      active
        ? `linear-gradient(90deg, ${colors["red-100"]} 0%, transparent 100%)`
        : colors["gray-100"]};
    color: ${({ active }) => (active ? colors["red-600"] : colors["gray-800"])};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    width: auto;
    padding: 10px 16px;
    border-radius: 20px;
    border-left: none;
    background: ${({ active }) =>
      active ? colors["red-500"] : colors["gray-200"]};
    color: ${({ active }) => (active ? "white" : colors["gray-600"])};
    white-space: nowrap;

    &:hover {
      background: ${({ active }) =>
        active ? colors["red-500"] : colors["gray-300"]};
      color: ${({ active }) => (active ? "white" : colors["gray-800"])};
    }
  }
`;

export const SidebarDivider = styled.div`
  height: 1px;
  background: ${colors["gray-200"]};
  margin: 12px 20px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarStats = styled.div`
  padding: 0 20px;
  margin-top: 16px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SidebarStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid ${colors["gray-100"]};

  &:last-child {
    border-bottom: none;
  }
`;

export const SidebarStatLabel = styled.span`
  font-size: 0.85rem;
  color: ${colors["gray-500"]};
`;

export const SidebarStatValue = styled.span`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${colors["gray-800"]};
`;

// ============ MAIN CONTENT ============
export const MainContent = styled.main`
  flex: 1;
  padding: 24px 32px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

export const ContentTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin: 0;
`;

// ============ PROFILE TAB ============
export const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(
      90deg,
      ${colors["red-500"]},
      ${colors["yellow-500"]}
    );
  }
`;

export const ProfileSection = styled.div`
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors["gray-800"]};
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: ${colors["gray-500"]};
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCard = styled.div<{ color?: string }>`
  background: ${({ color }) => color || colors["blue-100"]};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const StatValue = styled.div<{ textColor?: string }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${({ textColor }) => textColor || colors["blue-600"]};
  margin-bottom: 4px;
`;

export const StatLabel = styled.div<{ textColor?: string }>`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ textColor }) => textColor || colors["blue-700"]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const ExperienceSection = styled.div`
  margin-top: 20px;
`;

export const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

export const ExperienceLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors["gray-700"]};
`;

export const ExperienceValue = styled.span`
  font-size: 0.8rem;
  color: ${colors["gray-500"]};
`;

export const ExperienceBar = styled.div`
  width: 100%;
  height: 12px;
  background: ${colors["gray-200"]};
  border-radius: 8px;
  overflow: hidden;
`;

export const ExperienceFill = styled.div<{ percentage: number }>`
  width: ${({ percentage }) => percentage}%;
  height: 100%;
  background: linear-gradient(
    90deg,
    ${colors["green-400"]} 0%,
    ${colors["green-500"]} 100%
  );
  border-radius: 8px;
  transition: width 0.5s ease;
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const InfoLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors["gray-500"]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InfoValue = styled.span`
  font-size: 0.95rem;
  color: ${colors["gray-800"]};
  font-weight: 500;
`;

export const InfoInput = styled.input`
  font-size: 0.95rem;
  color: ${colors["gray-800"]};
  font-weight: 500;
  padding: 8px 12px;
  border: 2px solid ${colors["gray-300"]};
  border-radius: 8px;
  transition: all 0.2s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: ${colors["red-500"]};
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &:disabled {
    background: ${colors["gray-100"]};
    cursor: not-allowed;
    opacity: 0.6;
  }

  &::placeholder {
    color: ${colors["gray-400"]};
  }
`;

export const SectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

export const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: ${colors["blue-500"]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["blue-600"]};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const EditActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const CancelButton = styled.button`
  padding: 8px 16px;
  background: white;
  color: ${colors["gray-700"]};
  border: 2px solid ${colors["gray-300"]};
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${colors["gray-400"]};
    background: ${colors["gray-500"]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SaveButton = styled.button`
  padding: 8px 16px;
  background: ${colors["green-500"]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["green-600"]};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const AchievementBadges = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const Badge = styled.div<{ bgColor?: string; textColor?: string }>`
  background: ${({ bgColor }) => bgColor || colors["purple-100"]};
  color: ${({ textColor }) => textColor || colors["purple-700"]};
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

export const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${({ variant }) =>
    variant === "secondary"
      ? `
    background: white;
    color: ${colors["gray-700"]};
    border: 2px solid ${colors["gray-300"]};

    &:hover {
      border-color: ${colors["blue-400"]};
      color: ${colors["blue-600"]};
    }
  `
      : `
    background: linear-gradient(135deg, ${colors["red-500"]} 0%, ${colors["red-600"]} 100%);
    color: white;
    border: none;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    }
  `}
`;

// ============ MY POKEMON TAB ============
export const PokemonGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);

  @media (min-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export const PokemonCardWrapper = styled.div`
  position: relative;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
`;

export const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 16px;
  opacity: 0.3;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const EmptyText = styled.p`
  color: ${colors["gray-500"]};
  font-size: 1rem;
  margin: 0 0 16px 0;
`;

// ============ LOADING & ERROR ============
export const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 16px;
`;

export const LoadingText = styled.p`
  color: ${colors["gray-600"]};
  font-size: 0.95rem;
`;

export const ErrorContainer = styled.div`
  background: ${colors["red-100"]};
  border: 1px solid ${colors["red-200"]};
  border-radius: 12px;
  padding: 24px;
  text-align: center;
`;

export const ErrorText = styled.p`
  color: ${colors["red-600"]};
  font-size: 1rem;
  margin: 0 0 16px 0;
`;

// ============ DELETE MODAL ============
export const DeleteConfirmationModal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  max-width: 400px;

  .modal-buttons {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
`;

export const PokemonCount = styled.span`
  font-size: 0.9rem;
  color: ${colors["gray-500"]};
  font-weight: 500;
`;

// ============ AVATAR PICKER MODAL ============
export const AvatarModal = styled.div`
  background: white;
  border-radius: 20px;
  width: 90vw;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

export const AvatarModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${colors["gray-200"]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

export const AvatarModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin: 0;
`;

export const AvatarModalClose = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: ${colors["gray-100"]};
  color: ${colors["gray-600"]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["gray-200"]};
    color: ${colors["gray-800"]};
  }
`;

export const AvatarSearchContainer = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${colors["gray-200"]};
  flex-shrink: 0;
`;

export const AvatarSearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${colors["gray-200"]};
  border-radius: 12px;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors["red-400"]};
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  &::placeholder {
    color: ${colors["gray-400"]};
  }
`;

export const AvatarGrid = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-content: start;

  /* Fade effect at top and bottom edges */
  mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

export const AvatarOption = styled.button<{ selected?: boolean }>`
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid
    ${({ selected }) => (selected ? colors["red-500"] : colors["gray-200"])};
  background: ${({ selected }) =>
    selected ? colors["red-100"] : colors["gray-100"]};
  cursor: pointer;
  padding: 8px;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;

  &:hover {
    border-color: ${colors["red-400"]};
    background: ${colors["red-100"]};
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: auto;
    max-height: 70%;
    object-fit: contain;
    image-rendering: pixelated;
    flex: 1;
  }
`;

export const AvatarOptionName = styled.span`
  font-size: 0.7rem;
  color: ${colors["gray-700"]};
  font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  line-height: 1.2;
`;

export const AvatarOptionId = styled.span`
  font-size: 0.65rem;
  color: ${colors["gray-400"]};
  font-weight: 500;
`;

export const AvatarModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${colors["gray-200"]};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
`;

export const AvatarLoadingMore = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: center;
  padding: 20px;
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const AvatarSkeleton = styled.div`
  aspect-ratio: 1;
  border-radius: 12px;
  border: 3px solid ${colors["gray-200"]};
  background: ${colors["gray-100"]};
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const AvatarSkeletonImage = styled.div`
  width: 70%;
  height: 60%;
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    ${colors["gray-200"]} 0px,
    ${colors["gray-100"]} 40px,
    ${colors["gray-200"]} 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const AvatarSkeletonName = styled.div`
  width: 70%;
  height: 12px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${colors["gray-200"]} 0px,
    ${colors["gray-100"]} 40px,
    ${colors["gray-200"]} 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const AvatarSkeletonId = styled.div`
  width: 40%;
  height: 10px;
  border-radius: 4px;
  background: linear-gradient(
    90deg,
    ${colors["gray-200"]} 0px,
    ${colors["gray-100"]} 40px,
    ${colors["gray-200"]} 80px
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;
