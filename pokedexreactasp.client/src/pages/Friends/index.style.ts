import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";
import { colors } from "../../components/utils";

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(76, 175, 80, 0); }
`;

// ============ LAYOUT ============
export const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: white;
  padding: 24px;
  padding-bottom: 100px;

  @media (max-width: 768px) {
    padding: 16px;
    padding-bottom: 100px;
  }
`;

// ============ STATS HEADER ============
export const StatsHeader = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

export const StatCard = styled.div`
  flex: 1;
  min-width: 160px;
  background: ${colors["gray-100"]};
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid ${colors["gray-200"]};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

export const StatIcon = styled.div<{ $color?: "blue" | "green" }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) =>
    props.$color === "green"
      ? `linear-gradient(135deg, ${colors["green-400"]} 0%, ${colors["green-500"]} 100%)`
      : `linear-gradient(135deg, ${colors["blue-400"]} 0%, ${colors["blue-500"]} 100%)`};
  color: white;

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StatValue = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${colors["gray-900"]};
`;

export const StatLabel = styled.span`
  font-size: 14px;
  color: ${colors["gray-500"]};
  font-weight: 500;
`;

export const AddFriendButton = styled.button`
  background: linear-gradient(135deg, ${colors["red-500"]} 0%, ${colors["red-400"]} 100%);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 20px 28px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }
`;

// ============ SEARCH ============
export const SearchContainer = styled.div`
  background: ${colors["gray-100"]};
  border-radius: 14px;
  padding: 14px 18px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  border: 2px solid ${colors["gray-200"]};
  transition: all 0.2s ease;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  &:focus-within {
    border-color: ${colors["red-400"]};
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }

  svg {
    color: ${colors["gray-400"]};
    flex-shrink: 0;
  }

  input {
    flex: 1;
    background: none;
    border: none;
    color: ${colors["gray-900"]};
    font-size: 16px;
    outline: none;

    &::placeholder {
      color: ${colors["gray-400"]};
    }
  }
`;

// ============ FRIENDS LIST ============
export const FriendsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const FriendSection = styled.div``;

export const SectionTitle = styled.h3`
  color: ${colors["gray-700"]};
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  .online-dot {
    color: ${colors["green-500"]};
    font-size: 14px;
  }
`;

export const FriendsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

export const FriendCard = styled.div<{ $online?: boolean }>`
  background: white;
  border-radius: 20px;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${(props) => (props.$online ? colors["green-200"] : colors["gray-200"])};
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$online &&
    css`
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, ${colors["green-400"]}, ${colors["green-500"]});
      }
    `}

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
    border-color: ${(props) => (props.$online ? colors["green-400"] : colors["red-400"])};
  }
`;

export const FriendAvatar = styled.div<{ $online?: boolean }>`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors["yellow-200"]} 0%, ${colors["yellow-400"]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
  color: ${colors["gray-700"]};
  position: relative;
  border: 4px solid ${(props) => (props.$online ? colors["green-400"] : colors["gray-200"])};
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  ${(props) =>
    props.$online &&
    css`
      animation: ${float} 3s ease-in-out infinite, ${pulse} 2s infinite;
    `}

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const FriendName = styled.span`
  color: ${colors["gray-800"]};
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
`;

export const FriendLevel = styled.span`
  color: ${colors["yellow-600"]};
  font-size: 13px;
  font-weight: 700;
  background: ${colors["yellow-100"]};
  padding: 2px 10px;
  border-radius: 12px;
`;

export const FriendStatus = styled.span<{ $online?: boolean }>`
  color: ${(props) => (props.$online ? colors["green-600"] : colors["gray-400"])};
  font-size: 12px;
  font-weight: 500;
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
`;

export const QuickActionBtn = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 2px solid ${colors["gray-200"]};
  background: white;
  color: ${colors["gray-600"]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, ${colors["red-500"]} 0%, ${colors["red-400"]} 100%);
    border-color: ${colors["red-500"]};
    color: white;
    transform: scale(1.08);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ============ EMPTY STATE ============
export const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: ${colors["gray-500"]};

  svg {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    color: ${colors["gray-300"]};
  }

  h3 {
    color: ${colors["gray-700"]};
    font-size: 20px;
    margin-bottom: 8px;
  }

  p {
    margin-bottom: 24px;
    color: ${colors["gray-500"]};
  }
`;

// ============ MODAL STYLES ============
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

export const FriendDetailModal = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  max-width: 420px;
  width: 100%;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    color: ${colors["gray-800"]};
    margin: 0;
    flex: 1;
    text-align: center;
    font-size: 18px;
  }
`;

export const ModalClose = styled.button`
  background: ${colors["gray-100"]};
  border: none;
  color: ${colors["gray-500"]};
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  transition: all 0.2s ease;
  position: absolute;
  right: 16px;
  top: 16px;

  &:hover {
    background: ${colors["gray-200"]};
    color: ${colors["gray-700"]};
  }
`;

export const FriendDetailAvatar = styled.div<{ $online?: boolean }>`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors["yellow-200"]} 0%, ${colors["yellow-400"]} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: 700;
  color: ${colors["gray-700"]};
  margin: 0 auto 20px;
  border: 5px solid ${(props) => (props.$online ? colors["green-400"] : colors["gray-200"])};
  animation: ${float} 3s ease-in-out infinite;

  ${(props) =>
    props.$online &&
    css`
      animation: ${float} 3s ease-in-out infinite, ${pulse} 2s infinite;
    `}

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const FriendDetailName = styled.h2`
  color: ${colors["gray-800"]};
  margin: 0 0 4px 0;
  font-size: 26px;

  .username {
    display: block;
    color: ${colors["gray-400"]};
    font-size: 14px;
    font-weight: 400;
    margin-top: 4px;
  }
`;

export const FriendDetailLevel = styled.div`
  color: ${colors["yellow-600"]};
  font-size: 16px;
  font-weight: 700;
  background: ${colors["yellow-100"]};
  padding: 6px 16px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 8px;
`;

export const FriendDetailStatus = styled.div<{ $online?: boolean }>`
  color: ${(props) => (props.$online ? colors["green-600"] : colors["gray-400"])};
  font-size: 14px;
  margin-bottom: 24px;
  font-weight: 500;
`;

export const FriendDetailStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: ${colors["gray-100"]};
  border-radius: 16px;
`;

export const DetailStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .value {
    font-size: 28px;
    font-weight: 700;
    color: ${colors["gray-800"]};
  }

  .label {
    font-size: 12px;
    color: ${colors["gray-500"]};
    font-weight: 500;
  }
`;

export const FriendDetailInfo = styled.div`
  color: ${colors["gray-500"]};
  font-size: 14px;
  margin-bottom: 24px;
`;

export const FriendDetailActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

export const ActionButton = styled.button<{ $variant?: "primary" | "danger" }>`
  padding: 14px 16px;
  border: none;
  border-radius: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 14px;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return css`
          background: linear-gradient(135deg, ${colors["red-500"]} 0%, ${colors["red-400"]} 100%);
          color: white;
          box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
          }
        `;
      case "danger":
        return css`
          background: ${colors["red-100"]};
          color: ${colors["red-600"]};
          border: 2px solid ${colors["red-200"]};
          &:hover {
            background: ${colors["red-100"]};
            border-color: ${colors["red-300"]};
          }
        `;
      default:
        return css`
          background: ${colors["gray-100"]};
          color: ${colors["gray-700"]};
          border: 2px solid ${colors["gray-200"]};
          &:hover {
            background: ${colors["gray-200"]};
            border-color: ${colors["gray-300"]};
          }
        `;
    }
  }}

  svg {
    width: 18px;
    height: 18px;
  }
`;

// ============ GIFT MODAL ============
export const GiftModal = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  position: relative;
`;

export const GiftGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

export const GiftItem = styled.div`
  background: ${colors["gray-100"]};
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${colors["gray-200"]};

  &:hover {
    border-color: ${colors["yellow-400"]};
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    background: ${colors["yellow-100"]};
  }

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  span {
    color: ${colors["gray-700"]};
    font-size: 12px;
    text-align: center;
    font-weight: 500;
  }

  .quantity {
    color: ${colors["green-600"]};
    font-weight: 700;
  }
`;

// ============ POKEMON MODAL ============
export const PokemonModal = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  position: relative;
  max-height: 80vh;
  overflow-y: auto;
`;

export const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
`;

export const PokemonCard = styled.div`
  background: ${colors["gray-100"]};
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
  border: 2px solid ${colors["gray-200"]};

  &:hover {
    transform: translateY(-4px);
    border-color: ${colors["red-400"]};
    box-shadow: 0 8px 20px rgba(239, 68, 68, 0.15);
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    image-rendering: pixelated;
  }

  .name {
    color: ${colors["gray-800"]};
    font-weight: 600;
    font-size: 14px;
    text-transform: capitalize;
  }

  .species {
    color: ${colors["gray-400"]};
    font-size: 12px;
    text-transform: capitalize;
  }
`;

export const LoadingPokemon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: ${colors["gray-500"]};
`;

export const EmptyPokemon = styled.div`
  text-align: center;
  padding: 60px;
  color: ${colors["gray-400"]};

  svg {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
    color: ${colors["gray-300"]};
  }
`;

// ============ CONFIRMATION MODAL ============
export const ConfirmModal = styled.div`
  text-align: center;
  padding: 20px;

  strong {
    color: ${colors["red-500"]};
  }
`;

export const ConfirmButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`;
