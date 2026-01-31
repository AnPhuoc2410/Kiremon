import styled from "@emotion/styled";
import { RegionTheme } from "@/components/utils/regionThemes";

interface ThemedProps {
  theme?: RegionTheme;
}

export const GenerationContainer = styled.div<ThemedProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.theme ? `${props.theme.background}ee` : "rgba(255, 255, 255, 0.9)"};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border: 1px solid ${(props) => props.theme?.primary || "#ddd"};
`;

export const TitleArea = styled.div<ThemedProps>`
  margin-bottom: 20px;
  text-align: center;

  h1 {
    margin-bottom: 0;
    color: ${(props) => props.theme?.primary || "#333"};
  }

  h2 {
    margin-top: 5px;
    color: ${(props) => props.theme?.secondary || "#666"};
  }
`;

export const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

interface TabButtonProps {
  active: boolean;
  theme?: RegionTheme;
}

export const TabButton = styled.button<TabButtonProps>`
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  background-color: ${(props) =>
    props.active
      ? props.theme?.primary || "#ef5350"
      : props.theme?.background || "#f2f2f2"};
  color: ${(props) =>
    props.active ? "white" : props.theme?.secondary || "#333"};
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${(props) =>
      props.active
        ? props.theme?.primary || "#ef5350"
        : props.theme?.overlay || "#e0e0e0"};
    transform: translateY(-2px);
  }
`;

export const GenerationContent = styled.div`
  width: 100%;
`;

export const TabContent = styled.div<ThemedProps>`
  padding: 20px;
  background-color: ${(props) => props.theme?.overlay || "#fafafa"};
  border-radius: 8px;
  min-height: 300px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.05);
`;

export const PokemonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
`;

export const PokemonCard = styled.div<ThemedProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
  border: 1px solid #eee;

  img {
    image-rendering: pixelated;
    width: 96px;
    height: 96px;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border-color: ${(props) => props.theme?.accent || "#ddd"};
  }
`;

export const VersionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
`;

export const VersionCard = styled.div<ThemedProps>`
  padding: 15px;
  border-radius: 8px;
  background-color: ${(props) =>
    props.theme ? `${props.theme.background}dd` : "#e8f5e9"};
  border: 1px solid ${(props) => props.theme?.secondary || "#c8e6c9"};
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const MovesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;

  .move-item {
    padding: 10px;
    border-radius: 5px;
    background-color: #e3f2fd;
    text-align: center;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
`;

export const Pagination = styled.div<ThemedProps>`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 10px;

  button {
    padding: 5px 15px;
    border: 1px solid ${(props) => props.theme?.primary || "#ddd"};
    background-color: ${(props) => props.theme?.background || "white"};
    border-radius: 5px;
    cursor: pointer;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background-color: ${(props) => props.theme?.overlay || "#f0f0f0"};
    }
  }
`;

export const PageInfo = styled.span`
  padding: 5px 15px;
  font-size: 14px;
`;
