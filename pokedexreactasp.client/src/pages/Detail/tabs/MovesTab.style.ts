import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";

// ============ Type Color System ============
export const typeColors: Record<string, { bg: string; text: string }> = {
  normal: { bg: "#A8A77A", text: "#fff" },
  fire: { bg: "#EE8130", text: "#fff" },
  water: { bg: "#6390F0", text: "#fff" },
  electric: { bg: "#F7D02C", text: "#1f2937" },
  grass: { bg: "#7AC74C", text: "#fff" },
  ice: { bg: "#96D9D6", text: "#1f2937" },
  fighting: { bg: "#C22E28", text: "#fff" },
  poison: { bg: "#A33EA1", text: "#fff" },
  ground: { bg: "#E2BF65", text: "#1f2937" },
  flying: { bg: "#A98FF3", text: "#fff" },
  psychic: { bg: "#F95587", text: "#fff" },
  bug: { bg: "#A6B91A", text: "#fff" },
  rock: { bg: "#B6A136", text: "#fff" },
  ghost: { bg: "#735797", text: "#fff" },
  dragon: { bg: "#6F35FC", text: "#fff" },
  dark: { bg: "#705746", text: "#fff" },
  steel: { bg: "#B7B7CE", text: "#1f2937" },
  fairy: { bg: "#D685AD", text: "#fff" },
};

// ============ Animations ============
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============ Main Container ============
export const Container = styled.div`
  padding: 16px 0;
  animation: ${fadeIn} 0.3s ease-out;
`;

// ============ Section Header ============
export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
    text-transform: uppercase;
  }

  svg {
    color: #6b7280;
  }
`;

// ============ Type Defenses Section ============
export const TypeDefenseContainer = styled.div`
  margin-bottom: 32px;
`;

export const TypeDefenseDescription = styled.p`
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.5;

  strong {
    color: #1f2937;
  }
`;

export const EffectivenessCategory = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const CategoryLabel = styled.div<{
  variant: "weak" | "resistant" | "immune";
}>`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${({ variant }) => {
    switch (variant) {
      case "weak":
        return "#dc2626";
      case "resistant":
        return "#16a34a";
      case "immune":
        return "#6b7280";
    }
  }};

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const TypeDefenseGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const TypeChip = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: ${({ type }) => typeColors[type]?.bg || "#a8a77a"};
  color: ${({ type }) => typeColors[type]?.text || "#fff"};
  border-radius: 4px;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.15);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }

  img {
    width: 16px;
    height: 16px;
    filter: ${({ type }) =>
      typeColors[type]?.text === "#1f2937"
        ? "none"
        : "brightness(0) invert(1)"};
  }

  .multiplier {
    background: rgba(0, 0, 0, 0.2);
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 0.75rem;
    font-weight: 700;
    margin-left: 4px;
  }
`;

// ============ Move Pool Section ============
export const MovePoolContainer = styled.div`
  margin-top: 24px;
`;

export const MoveCategoryCard = styled.div`
  margin-bottom: 24px;
`;

export const MoveCategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;

  .title-group {
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      color: #6b7280;
    }

    h4 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #1f2937;
      text-transform: uppercase;
    }

    .count {
      background: #e5e7eb;
      color: #374151;
      padding: 2px 10px;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 600;
    }
  }

  .expand-btn {
    background: transparent;
    border: none;
    color: #3b82f6;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: background 0.2s ease;

    &:hover {
      background: #eff6ff;
    }
  }
`;

export const MoveGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 10px;
`;

export const MoveCard = styled.div<{ moveType: string }>`
  display: flex;
  align-items: stretch;
  background: #fafafa;
  border-radius: 6px;
  border-radius: 6px;
  position: relative;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
  box-shadow: 3px 3px 0 #e5e7eb;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 4px 4px 0 #d1d5db;
  }

  .type-indicator {
    width: 5px;
    background: ${({ moveType }) => typeColors[moveType]?.bg || "#a8a878"};
    flex-shrink: 0;
  }

  .move-content {
    flex: 1;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .move-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .move-name {
    font-weight: 700;
    font-size: 1rem;
    color: #1f2937;
    text-transform: capitalize;
    flex: 1;
    line-height: 1.3;
  }

  .move-type-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    background: ${({ moveType }) => typeColors[moveType]?.bg || "#a8a878"};
    color: ${({ moveType }) => typeColors[moveType]?.text || "#fff"};
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;

    img {
      width: 14px;
      height: 14px;
      filter: ${({ moveType }) =>
        typeColors[moveType]?.text === "#1f2937"
          ? "none"
          : "brightness(0) invert(1)"};
    }
  }

  .move-stats {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    align-items: center;
  }

  .stat-chip {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.8rem;
    color: #6b7280;
    background: #f3f4f6;
    padding: 4px 8px;
    border-radius: 4px;

    .label {
      font-weight: 600;
    }

    .value {
      font-weight: 700;
      color: #374151;
    }

    &.level {
      background: #fef3c7;
      color: #92400e;

      .value {
        color: #78350f;
      }
    }
  }

  .damage-class {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.75rem;
    text-transform: uppercase;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 4px;

    svg {
      width: 14px;
      height: 14px;
    }

    &.physical {
      background: #fecaca;
      color: #991b1b;
    }

    &.special {
      background: #c7d2fe;
      color: #3730a3;
    }

    &.status {
      background: #e5e7eb;
      color: #374151;
    }
  }
`;

// ============ TM/HM Disc Style ============
export const TMDiscCard = styled.div<{ moveType: string }>`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fafafa;
  border-radius: 8px;
  padding: 10px;
  transition: transform 0.15s ease;
  box-shadow: 3px 3px 0 #e5e7eb;

  &:hover {
    transform: translateY(-2px);
  }

  .disc-icon {
    flex-shrink: 0;
    color: ${({ moveType }) => typeColors[moveType]?.bg || "#a8a878"};
    filter: drop-shadow(2px 2px 0 rgba(0, 0, 0, 0.15));
    width: 36px;
    height: 36px;
  }

  .disc-info {
    flex: 1;
    min-width: 0;

    .move-name {
      font-weight: 700;
      font-size: 1rem;
      color: #1f2937;
      text-transform: capitalize;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .move-meta {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }

    .meta-item {
      font-size: 0.8rem;
      color: #6b7280;

      span {
        color: #374151;
        font-weight: 700;
      }
    }
  }

  .type-badge {
    background: ${({ moveType }) => typeColors[moveType]?.bg || "#a8a878"};
    color: ${({ moveType }) => typeColors[moveType]?.text || "#fff"};
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    flex-shrink: 0;
  }
`;

// ============ Egg Move Style ============
export const EggMoveCard = styled.div<{ moveType: string }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fffbeb;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 3px 3px 0 #fde68a;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .egg-icon {
    width: 38px;
    height: 38px;
    background: #fef3c7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      color: #d97706;
      width: 22px;
      height: 22px;
    }
  }

  .egg-info {
    flex: 1;
    min-width: 0;

    .move-name {
      font-weight: 700;
      font-size: 1rem;
      color: #92400e;
      text-transform: capitalize;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .move-stats {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .stat {
      font-size: 0.8rem;
      color: #b45309;

      span {
        font-weight: 700;
      }
    }
  }

  .type-badge {
    background: ${({ moveType }) => typeColors[moveType]?.bg || "#a8a878"};
    color: ${({ moveType }) => typeColors[moveType]?.text || "#fff"};
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    flex-shrink: 0;
  }
`;

// ============ Tutor Move Style ============
export const TutorMoveCard = styled.div<{ moveType: string }>`
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f0fdf4;
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 3px 3px 0 #bbf7d0;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-2px);
  }

  .tutor-icon {
    width: 38px;
    height: 38px;
    background: #dcfce7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
      color: #16a34a;
      width: 22px;
      height: 22px;
    }
  }

  .tutor-info {
    flex: 1;
    min-width: 0;

    .move-name {
      font-weight: 700;
      font-size: 1rem;
      color: #166534;
      text-transform: capitalize;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .move-stats {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .stat {
      font-size: 0.8rem;
      color: #15803d;

      span {
        font-weight: 700;
      }
    }
  }

  .type-badge {
    background: ${({ moveType }) => typeColors[moveType]?.bg || "#a8a878"};
    color: ${({ moveType }) => typeColors[moveType]?.text || "#fff"};
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    flex-shrink: 0;
  }
`;

// ============ Effect Badges ============
export const EffectBadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const EffectBadge = styled.span<{
  badgeColor: string;
  variant?: "outlined" | "filled";
}>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  background: ${({ badgeColor, variant }) =>
    variant === "filled" ? badgeColor : `${badgeColor}15`};
  color: ${({ badgeColor, variant }) =>
    variant === "filled" ? "#ffffff" : badgeColor};
  border: 1px solid
    ${({ badgeColor, variant }) =>
      variant === "filled" ? "transparent" : `${badgeColor}40`};
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }

    transform: translateY(-1px);
    box-shadow: 0 2px 4px ${({ badgeColor }) => `${badgeColor}30`};
  }
`;

export const SplitBadge = styled.div<{ badgeColor: string }>`
  display: inline-flex;
  align-items: stretch;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${({ badgeColor }) => `${badgeColor}40`};
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px ${({ badgeColor }) => `${badgeColor}20`};
  }

  .left {
    background: #f3f4f6;
    color: #4b5563;
    padding: 4px 8px;
    display: flex;
    align-items: center;
    border-right: 1px solid ${({ badgeColor }) => `${badgeColor}20`};
  }

  .right {
    background: ${({ badgeColor }) => `${badgeColor}15`};
    color: ${({ badgeColor }) => badgeColor};
    padding: 4px 8px;
    display: flex;
    align-items: center;
    gap: 5px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const GroupedSplitBadge = styled(SplitBadge)`
  .left {
    font-size: 0.9rem;
    padding: 0 12px;
    color: #374151;
    font-weight: 800;
  }

  .right {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    padding: 4px 6px;
    max-width: 300px;
  }
`;

export const MiniStatBadge = styled.span<{ color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 0.7rem;
  padding: 2px 4px;
  border-radius: 4px;
  background: white;
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}40`};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const MoveDescription = styled.div`
  font-size: 0.85rem;
  color: #4b5563;
  line-height: 1.5;
  margin-top: 8px;
  padding: 8px 10px;
  background: #f9fafb;
  border-radius: 4px;
  border-left: 3px solid #d1d5db;
`;

export const MoveInfoIcon = styled.button`
  background: transparent;
  border: none;
  padding: 2px;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s ease;

  &:hover {
    color: #6b7280;
  }
`;

// ============ Empty State ============
export const EmptyState = styled.div`
  text-align: center;
  padding: 32px 16px;
  color: #9ca3af;
  font-style: italic;
`;

// ============ Show More Button ============
export const ShowMoreButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background: #f3f4f6;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  color: #6b7280;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #e5e7eb;
    color: #4b5563;
    border-color: #9ca3af;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ============ Filter Buttons ============
export const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

export const FilterButton = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 2px solid transparent;

  svg {
    width: 16px;
    height: 16px;
  }

  ${({ isActive }) =>
    isActive
      ? `
          background: #1e40af;
          color: white;
          border-color: #1e40af;
        `
      : `
          background: #f3f4f6;
          color: #6b7280;
          border-color: #e5e7eb;

          &:hover {
            background: #e5e7eb;
            color: #4b5563;
          }
        `}
`;

export const InfoPopover = styled.div<{ isOpen: boolean }>`
position: absolute;
bottom: calc(100 % + 10px);
left: 50 %;
transform: translateX(-50 %) translateY(${({ isOpen }) => (isOpen ? "0" : "10px")});
width: 280px;
background: white;
padding: 12px 16px;
border - radius: 12px;
box - shadow: 0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
z - index: 100;
text - align: center;
font - size: 0.9rem;
color: #374151;
pointer - events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
transition: all 0.25s cubic - bezier(0.16, 1, 0.3, 1);
line - height: 1.5;

  &::after {
  content: "";
  position: absolute;
  top: 100 %;
  left: 50 %;
  margin - left: -8px;
  border - width: 8px;
  border - style: solid;
  border - color: white transparent transparent transparent;
}
`;
