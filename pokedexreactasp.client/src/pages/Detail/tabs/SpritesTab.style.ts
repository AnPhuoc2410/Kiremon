import styled from "@emotion/styled";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const SpriteContainer = styled.div`
  padding: 16px 0;
`;

export const SpriteGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 16px;
`;

export const SpriteItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

export const SpriteImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 120px;
  width: 120px;
`;

export const SpriteLabel = styled.span`
  margin-top: 8px;
  font-size: 12px;
  color: #4b5563;
  text-align: center;
`;

export const GenerationTitle = styled.h4`
  margin-top: 32px;
  margin-bottom: 16px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
`;

export const VersionsContainer = styled.div`
  margin-top: 32px;
`;
