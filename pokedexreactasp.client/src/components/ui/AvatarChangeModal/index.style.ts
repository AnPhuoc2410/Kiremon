import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { colors } from "../../utils";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
  backdrop-filter: blur(4px);
`;

export const ModalContainer = styled.div`
  background: white;
  border-radius: 20px;
  width: 90vw;
  max-width: 650px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: ${slideUp} 0.3s ease-out;
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid ${colors["gray-200"]};
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  background: linear-gradient(
    135deg,
    ${colors["red-500"]} 0%,
    ${colors["red-600"]} 100%
  );
`;

export const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
  margin: 0;
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
  }
`;

export const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors["gray-200"]};
  background: ${colors["gray-100"]};
  flex-shrink: 0;
`;

export const Tab = styled.button<{ active?: boolean }>`
  flex: 1;
  padding: 14px 20px;
  border: none;
  background: ${({ active }) => (active ? "white" : "transparent")};
  color: ${({ active }) => (active ? colors["red-600"] : colors["gray-600"])};
  font-size: 0.95rem;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-bottom: 3px solid
    ${({ active }) => (active ? colors["red-500"] : "transparent")};

  &:hover {
    background: ${({ active }) => (active ? "white" : colors["gray-100"])};
    color: ${({ active }) => (active ? colors["red-600"] : colors["gray-800"])};
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 12px 16px;

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const SearchContainer = styled.div`
  padding: 16px 24px;
  border-bottom: 1px solid ${colors["gray-200"]};
  flex-shrink: 0;
  position: relative;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
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

export const SearchSpinner = styled.div`
  position: absolute;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border: 2px solid ${colors["gray-200"]};
  border-top-color: ${colors["red-500"]};
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to {
      transform: translateY(-50%) rotate(360deg);
    }
  }
`;

export const ScrollableContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

export const AvatarCard = styled.button<{ selected?: boolean }>`
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
  position: relative;

  &:hover {
    border-color: ${colors["red-400"]};
    background: ${colors["red-100"]};
    transform: scale(1.05);
  }

  ${({ selected }) =>
    selected &&
    `
    box-shadow: 0 0 0 2px ${colors["red-200"]};
    
    &::after {
      content: "✓";
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
      background: ${colors["red-500"]};
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
    }
  `}
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: auto;
  max-height: 70%;
  object-fit: contain;
  image-rendering: pixelated;
  flex: 1;
`;

export const AvatarName = styled.span`
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

export const AvatarId = styled.span`
  font-size: 0.65rem;
  color: ${colors["gray-400"]};
  font-weight: 500;
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

export const SkeletonImage = styled.div`
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

export const SkeletonName = styled.div`
  width: 70%;
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

export const SkeletonId = styled.div`
  width: 40%;
  height: 8px;
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

export const UploadContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 20px;
`;

export const UploadProgress = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${colors["gray-200"]};
  border-radius: 4px;
  overflow: hidden;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${(props) => props.progress}%;
    background: linear-gradient(
      90deg,
      ${colors["red-500"]},
      ${colors["red-600"]}
    );
    transition: width 0.3s ease;
  }
`;

export const ProgressText = styled.p`
  font-size: 0.875rem;
  color: ${colors["gray-600"]};
  text-align: center;
  margin: 0;
  font-weight: 500;
`;

export const UploadBox = styled.div`
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1;
  max-height: 400px;
  border: 3px dashed ${colors["gray-300"]};
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${colors["gray-100"]};

  &:hover {
    border-color: ${colors["red-400"]};
    background: ${colors["red-100"]};
    transform: scale(1.02);

    svg {
      color: ${colors["red-500"]};
    }
  }

  &.dragging {
    border-color: ${colors["red-500"]};
    background: ${colors["red-200"]};
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);

    svg {
      color: ${colors["red-600"]};
      transform: scale(1.1);
    }
  }

  svg {
    color: ${colors["gray-400"]};
    transition: all 0.2s ease;
  }
`;

export const UploadText = styled.p`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors["gray-700"]};
  margin: 0;
`;

export const UploadHint = styled.p`
  font-size: 0.85rem;
  color: ${colors["gray-500"]};
  margin: 0;
`;

export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const PreviewImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid ${colors["red-500"]};
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.25);
`;

export const ChangeButton = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  color: ${colors["gray-700"]};
  border: 2px solid ${colors["gray-300"]};

  &:hover {
    border-color: ${colors["red-400"]};
    color: ${colors["red-600"]};
  }
`;

export const UrlContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px;
`;

export const UrlInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

export const UrlInput = styled.input`
  flex: 1;
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

export const UrlButton = styled.button`
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(
    135deg,
    ${colors["red-500"]} 0%,
    ${colors["red-600"]} 100%
  );
  color: white;
  border: none;
  box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid ${colors["gray-200"]};
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  background: ${colors["gray-100"]};
`;

export const CancelButton = styled.button`
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  color: ${colors["gray-700"]};
  border: 2px solid ${colors["gray-300"]};

  &:hover {
    border-color: ${colors["gray-400"]};
    color: ${colors["gray-800"]};
  }
`;

export const SaveButton = styled.button<{ disabled?: boolean }>`
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  background: ${({ disabled }) =>
    disabled
      ? colors["gray-300"]
      : `linear-gradient(135deg, ${colors["red-500"]} 0%, ${colors["red-600"]} 100%)`};
  color: white;
  border: none;
  box-shadow: ${({ disabled }) =>
    disabled ? "none" : "0 4px 14px rgba(239, 68, 68, 0.3)"};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};

  &:hover {
    ${({ disabled }) =>
      !disabled &&
      `
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
    `}
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

export const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
  opacity: 0.3;
`;

export const EmptyText = styled.p`
  color: ${colors["gray-500"]};
  font-size: 1rem;
  margin: 0;
`;
