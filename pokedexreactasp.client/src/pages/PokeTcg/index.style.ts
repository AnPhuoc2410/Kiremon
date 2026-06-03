import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

const panelShadow = `
  0 1px 3px rgba(16, 24, 40, 0.1),
  0 1px 2px rgba(16, 24, 40, 0.06)
`;

export const Page = styled.main`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 10px 16px 40px;
  display: grid;
  gap: 16px;

  @media screen and (min-width: ${units.screenSize["xl"]}) {
    padding: 10px 0 40px;
  }
`;

export const IntroPanel = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 18px;
  align-items: center;
  min-height: 260px;
  padding: 20px;
  border: 3px solid ${colors["red-600"]};
  border-radius: 14px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0.9)),
    repeating-linear-gradient(
      0deg,
      rgba(239, 68, 68, 0.06) 0,
      rgba(239, 68, 68, 0.06) 2px,
      transparent 2px,
      transparent 18px
    );
  box-shadow: ${panelShadow};
  overflow: hidden;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const IntroCopy = styled.div`
  display: grid;
  gap: 12px;
  text-align: left;
`;

export const PixelLabel = styled.span`
  width: fit-content;
  padding: 6px 10px;
  border: 2px solid ${colors["gray-900"]};
  border-radius: 6px;
  background: ${colors["yellow-300"]};
  color: ${colors["gray-900"]};
  font-family: "VT323", monospace;
  font-size: 20px;
  line-height: 1;
`;

export const IntroTitle = styled.h2`
  margin: 0;
  color: ${colors["gray-900"]};
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1;
  letter-spacing: 0;
`;

export const IntroText = styled.p`
  max-width: 62ch;
  margin: 0;
  color: ${colors["gray-700"]};
  font-size: 15px;
  line-height: 1.7;
`;

export const SearchForm = styled.form`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 10px;
  max-width: 560px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const SearchInput = styled.input`
  min-height: 44px;
  width: 100%;
  border: 2px solid ${colors["gray-300"]};
  border-radius: 10px;
  padding: 0 14px;
  background: #ffffff;
  color: ${colors["gray-900"]};
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: ${colors["blue-500"]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
  }
`;

export const SearchButton = styled.button`
  min-height: 44px;
  border: 2px solid ${colors["gray-900"]};
  border-radius: 10px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: ${colors["yellow-300"]};
  color: ${colors["gray-900"]};
  cursor: pointer;
  font-weight: 800;
  box-shadow: inset -4px -4px ${colors["yellow-500"]};
  transition:
    transform 0.16s ease,
    background-color 0.16s ease;

  &:hover {
    background: ${colors["yellow-200"]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
    box-shadow: inset 4px 4px ${colors["yellow-500"]};
  }
`;

export const PreviewStack = styled.div`
  position: relative;
  min-height: 240px;
  display: grid;
  place-items: center;

  @media (max-width: 820px) {
    min-height: 210px;
  }
`;

export const PreviewCard = styled.img`
  width: min(190px, 64vw);
  border-radius: 12px;
  transform: rotate(5deg);
  box-shadow: 0 18px 28px rgba(16, 24, 40, 0.2);
`;

export const PreviewSprite = styled.img`
  position: absolute;
  left: 14px;
  bottom: 4px;
  width: 112px;
  height: 112px;
  image-rendering: pixelated;
  filter: drop-shadow(0 8px 10px rgba(16, 24, 40, 0.18));
`;

export const Toolbar = styled.section`
  display: grid;
  grid-template-columns: repeat(2, minmax(120px, 0.7fr)) repeat(
      3,
      minmax(150px, 1fr)
    );
  gap: 10px;
  padding: 14px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: ${panelShadow};

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const Stat = styled.div`
  min-height: 42px;
  border-radius: 9px;
  padding: 8px 10px;
  background: ${colors["blue-100"]};
  border: 1px solid ${colors["blue-200"]};
  text-align: left;

  span {
    display: block;
    color: ${colors["blue-700"]};
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }

  strong {
    display: block;
    margin-top: 3px;
    color: ${colors["gray-900"]};
    text-transform: capitalize;
  }
`;

export const Select = styled.select`
  width: 100%;
  min-height: 42px;
  border: 1px solid ${colors["gray-300"]};
  border-radius: 9px;
  padding: 0 10px;
  background: #ffffff;
  color: ${colors["gray-900"]};
  outline: none;

  &:focus {
    border-color: ${colors["blue-500"]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.16);
  }
`;

export const HelperText = styled.p`
  margin: 0;
  color: ${colors["gray-600"]};
  font-size: 14px;
`;

export const CardGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
`;

export const CardButton = styled.button`
  border: 1px solid ${colors["gray-200"]};
  border-radius: 12px;
  padding: 12px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  display: grid;
  gap: 10px;
  box-shadow: ${panelShadow};
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    border-color: ${colors["blue-400"]};
    box-shadow:
      0 8px 16px rgba(59, 130, 246, 0.15),
      0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

export const CardImageWrap = styled.div`
  display: grid;
  place-items: center;
  border-radius: 10px;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0)),
    ${colors["gray-100"]};
  min-height: 230px;
`;

export const CardImage = styled.img`
  width: 100%;
  max-height: 230px;
  object-fit: contain;
  border-radius: 8px;
`;

export const CardMeta = styled.div`
  display: grid;
  gap: 5px;
`;

export const CardName = styled.strong`
  color: ${colors["gray-900"]};
  font-size: 14px;
  line-height: 1.3;
`;

export const CardSmall = styled.span`
  color: ${colors["gray-600"]};
  font-size: 12px;
  line-height: 1.35;
`;

export const RarityBadge = styled.span`
  width: fit-content;
  padding: 4px 8px;
  border-radius: 6px;
  background: ${colors["yellow-100"]};
  color: ${colors["yellow-700"]};
  font-size: 12px;
  font-weight: 800;
`;

export const Pager = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const PagerButton = styled.button`
  min-height: 38px;
  border: 1px solid ${colors["gray-300"]};
  border-radius: 9px;
  padding: 0 14px;
  background: #ffffff;
  color: ${colors["gray-900"]};
  cursor: pointer;
  font-weight: 700;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`;

export const PageCount = styled.span`
  color: ${colors["gray-700"]};
  font-weight: 700;
`;

export const StatePanel = styled.section`
  padding: 32px 20px;
  border-radius: 12px;
  background: #ffffff;
  color: ${colors["gray-700"]};
  text-align: center;
  box-shadow: ${panelShadow};
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(17, 24, 39, 0.62);
`;

export const ModalContent = styled.div`
  width: min(100%, 980px);
  max-height: 88vh;
  overflow: auto;
  border-radius: 16px;
  padding: 18px;
  background: #ffffff;
  border: 3px solid ${colors["red-600"]};
  display: grid;
  grid-template-columns: minmax(230px, 0.8fr) minmax(0, 1.2fr);
  gap: 18px;
  text-align: left;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const ModalImage = styled.img`
  width: min(100%, 360px);
  justify-self: center;
  border-radius: 12px;
  box-shadow: 0 18px 28px rgba(16, 24, 40, 0.18);
`;

export const ModalInfo = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const ModalTitle = styled.h3`
  margin: 0;
  color: ${colors["gray-900"]};
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  line-height: 1.1;
`;

export const CloseButton = styled.button`
  width: 36px;
  height: 36px;
  border: 1px solid ${colors["gray-300"]};
  border-radius: 9px;
  color: ${colors["gray-700"]};
  background: #ffffff;
  cursor: pointer;
  font-size: 20px;
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

export const DetailCell = styled.div`
  border-radius: 10px;
  padding: 11px;
  background: ${colors["gray-100"]};
  border: 1px solid ${colors["gray-200"]};

  span {
    display: block;
    color: ${colors["gray-600"]};
    font-size: 11px;
    font-weight: 800;
    text-transform: uppercase;
  }

  strong,
  p {
    display: block;
    margin: 6px 0 0;
    color: ${colors["gray-900"]};
    font-size: 13px;
    line-height: 1.5;
  }
`;
