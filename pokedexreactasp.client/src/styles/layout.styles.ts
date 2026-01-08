import styled from "@emotion/styled";
import { colors, units } from "../components/utils";

// ============ PAGE CONTAINERS ============
export const PageContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: white;
  position: relative;
`;

export const CenteredPage = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
`;

export const GradientPage = styled(CenteredPage)`
  background: linear-gradient(
    180deg,
    ${colors["red-100"]} 0%,
    ${colors["gray-100"]} 100%
  );
  background-image:
    radial-gradient(
      circle at 82% 18%,
      rgba(239, 68, 68, 0.06) 0,
      transparent 18%
    ),
    radial-gradient(
      circle at 18% 82%,
      rgba(59, 130, 246, 0.03) 0,
      transparent 20%
    );
`;

// ============ CONTENT WRAPPERS ============
export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${units.spacing.xl};
  padding: 0 16px;
  max-width: 1340px;
  margin: 0 auto;

  h3 {
    margin-bottom: ${units.spacing.base};
  }
`;

export const Container = styled.div`
  padding: 0 16px;
  margin-bottom: 60px;

  @media (min-width: 1024px) {
    padding: 0 128px;
  }
`;

export const MaxWidthContainer = styled.div<{ maxWidth?: string }>`
  width: 100%;
  max-width: ${(props) => props.maxWidth || "1200px"};
  margin: 0 auto;
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// ============ FLEX LAYOUTS ============
export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

// ============ GRID LAYOUTS ============
export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns || 1}, 1fr);
  gap: ${(props) => props.gap || units.spacing.base};
`;

export const AutoGrid = styled.div<{ minWidth?: string; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(props) => props.minWidth || "150px"}, 1fr)
  );
  gap: ${(props) => props.gap || "1rem"};
`;

// ============ SECTIONS ============
export const Section = styled.section<{ spacing?: "sm" | "md" | "lg" }>`
  margin-bottom: ${(props) => {
    switch (props.spacing) {
      case "sm":
        return "1rem";
      case "lg":
        return "3rem";
      default:
        return "2rem";
    }
  }};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

// ============ SIDEBAR LAYOUT ============
export const LayoutWithSidebar = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 80px);
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const Sidebar = styled.aside<{ width?: string }>`
  width: ${(props) => props.width || "280px"};
  background: white;
  border-right: 1px solid ${colors["gray-200"]};
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 80px;
  height: calc(100vh - 80px);
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
    border-right: none;
    border-bottom: 1px solid ${colors["gray-200"]};
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 24px;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

// ============ IMAGE CONTAINER ============
export const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;

  @media (min-width: 768px) {
    margin-bottom: 20px;
  }
`;

// ============ HEADER ============
export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
`;
