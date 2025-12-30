import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/react";

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(76, 175, 80, 0.5); }
  50% { box-shadow: 0 0 20px rgba(76, 175, 80, 0.8); }
`;

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding-bottom: 80px;
`;

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: ${(props) =>
    props.$active
      ? "linear-gradient(135deg, #ee1515 0%, #ff6b6b 100%)"
      : "rgba(255, 255, 255, 0.1)"};
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: ${(props) =>
      props.$active
        ? "linear-gradient(135deg, #ee1515 0%, #ff6b6b 100%)"
        : "rgba(255, 255, 255, 0.2)"};
    transform: translateY(-2px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const Badge = styled.span`
  background: #ff4444;
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 4px;
`;

export const Section = styled.section`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const SectionTitle = styled.h2`
  color: white;
  font-size: 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 24px;
    height: 24px;
    color: #ffd700;
  }
`;

export const FriendCodeSection = styled(Section)`
  text-align: center;
`;

export const FriendCodeDisplay = styled.div`
  background: linear-gradient(135deg, #2d3436 0%, #000000 100%);
  border-radius: 16px;
  padding: 24px;
  margin: 16px 0;
  border: 2px solid #ffd700;
`;

export const FriendCodeLabel = styled.p`
  color: #888;
  font-size: 14px;
  margin-bottom: 8px;
`;

export const FriendCode = styled.h1`
  color: #ffd700;
  font-size: 32px;
  font-family: "Courier New", monospace;
  letter-spacing: 4px;
  margin: 0;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
`;

export const QRCodeWrapper = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: inline-block;
  margin: 16px 0;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const ActionButton = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  ${(props) => {
    switch (props.$variant) {
      case "primary":
        return css`
          background: linear-gradient(135deg, #ee1515 0%, #ff6b6b 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(238, 21, 21, 0.4);
          }
        `;
      case "danger":
        return css`
          background: linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%);
          color: white;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(220, 53, 69, 0.4);
          }
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const AddFriendInput = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;

  input {
    flex: 1;
    padding: 14px 16px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 16px;
    font-family: "Courier New", monospace;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-align: center;

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1px;
      text-transform: none;
    }

    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
`;

export const FriendsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FriendCard = styled.div<{ $online?: boolean }>`
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }

  ${(props) =>
    props.$online &&
    css`
      border-left: 3px solid #4caf50;
    `}
`;

export const FriendAvatar = styled.div<{ $online?: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  ${(props) =>
    props.$online &&
    css`
      &::after {
        content: "";
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 14px;
        height: 14px;
        background: #4caf50;
        border-radius: 50%;
        border: 2px solid #1a1a2e;
        animation: ${glow} 2s ease-in-out infinite;
      }
    `}
`;

export const FriendInfo = styled.div`
  flex: 1;
`;

export const FriendName = styled.h3`
  color: white;
  font-size: 16px;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const FriendDetails = styled.p`
  color: #888;
  font-size: 13px;
  margin: 0;
`;

export const LevelBadge = styled.span`
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #000;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 8px;
  font-weight: 700;
`;

export const OnlineStatus = styled.span<{ $online?: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.$online ? "#4caf50" : "#888")};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const RequestCard = styled(FriendCard)`
  flex-wrap: wrap;
`;

export const RequestActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  padding-left: 72px;
`;

export const RequestMessage = styled.p`
  color: #aaa;
  font-size: 13px;
  font-style: italic;
  margin: 8px 0 0 72px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  width: calc(100% - 72px);
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #888;

  svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  h3 {
    color: white;
    margin-bottom: 8px;
  }

  p {
    font-size: 14px;
  }
`;

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 12px;
  text-align: center;

  h4 {
    color: #ffd700;
    font-size: 24px;
    margin: 0 0 4px 0;
  }

  p {
    color: #888;
    font-size: 12px;
    margin: 0;
  }
`;

export const ScannerOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ScannerFrame = styled.div`
  width: 280px;
  height: 280px;
  border: 3px solid #ffd700;
  border-radius: 20px;
  position: relative;
  margin-bottom: 24px;

  &::before,
  &::after {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    border-color: #ff4444;
    border-style: solid;
  }

  &::before {
    top: -3px;
    left: -3px;
    border-width: 3px 0 0 3px;
    border-radius: 20px 0 0 0;
  }

  &::after {
    bottom: -3px;
    right: -3px;
    border-width: 0 3px 3px 0;
    border-radius: 0 0 20px 0;
  }
`;

export const ScannerText = styled.p`
  color: white;
  font-size: 16px;
  text-align: center;
  margin-bottom: 24px;
`;

export const ConfirmModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ConfirmContent = styled.div`
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 20px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ConfirmTitle = styled.h3`
  color: white;
  margin-bottom: 16px;
`;

export const ConfirmText = styled.p`
  color: #888;
  margin-bottom: 24px;
`;

export const FriendshipStats = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 8px;
`;

export const FriendshipStat = styled.span`
  color: #888;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    width: 14px;
    height: 14px;
    color: #ffd700;
  }
`;
