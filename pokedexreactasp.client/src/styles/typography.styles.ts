import styled from "@emotion/styled";
import { colors } from "../components/utils";

// ============ HEADINGS ============
export const PageTitle = styled.h1<{ size?: "sm" | "md" | "lg" | "xl" }>`
  margin: 0;
  font-weight: 700;
  color: ${colors["gray-900"]};

  font-size: ${props => {
    switch (props.size) {
      case "sm": return "1.25rem";
      case "lg": return "2rem";
      case "xl": return "2.5rem";
      default: return "1.5rem";
    }
  }};
`;

export const SectionTitle = styled.h2<{ size?: "sm" | "md" | "lg" }>`
  margin: 0 0 8px 0;
  font-weight: 600;
  color: ${colors["gray-900"]};
  letter-spacing: 0.4px;

  font-size: ${props => {
    switch (props.size) {
      case "sm": return "1rem";
      case "lg": return "1.5rem";
      default: return "1.25rem";
    }
  }};
`;

export const CardTitle = styled.h3<{ size?: "sm" | "md" | "lg" }>`
  margin: 0;
  font-weight: 600;
  color: ${colors["gray-900"]};

  font-size: ${props => {
    switch (props.size) {
      case "sm": return "0.875rem";
      case "lg": return "1.25rem";
      default: return "1rem";
    }
  }};
`;

// ============ PARAGRAPHS ============
export const Paragraph = styled.p<{
  color?: "primary" | "secondary" | "muted";
  size?: "sm" | "md" | "lg";
}>`
  margin: 0;

  font-size: ${props => {
    switch (props.size) {
      case "sm": return "13px";
      case "lg": return "16px";
      default: return "14px";
    }
  }};

  color: ${props => {
    switch (props.color) {
      case "primary": return colors["gray-900"];
      case "muted": return colors["gray-500"];
      default: return colors["gray-600"];
    }
  }};
`;

export const Subtitle = styled.p`
  margin: 0 0 16px 0;
  color: ${colors["gray-600"]};
  font-size: 14px;
`;

export const SmallText = styled.small<{ color?: "default" | "muted" | "error" | "success" }>`
  font-size: 12px;

  color: ${props => {
    switch (props.color) {
      case "muted": return colors["gray-400"];
      case "error": return colors["red-500"];
      case "success": return colors["green-500"];
      default: return colors["gray-500"];
    }
  }};
`;

// ============ LINKS ============
export const Link = styled.a<{ variant?: "default" | "primary" | "muted" }>`
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;

  ${props => {
    switch (props.variant) {
      case "primary":
        return `
          color: ${colors["blue-600"]};
          &:hover { color: ${colors["blue-700"]}; text-decoration: underline; }
        `;
      case "muted":
        return `
          color: ${colors["gray-500"]};
          &:hover { color: ${colors["gray-700"]}; }
        `;
      default:
        return `
          color: ${colors["gray-700"]};
          &:hover { color: ${colors["blue-600"]}; }
        `;
    }
  }}
`;

// ============ LABELS / BADGES ============
export const Badge = styled.span<{
  variant?: "default" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
}>`
  display: inline-flex;
  align-items: center;
  padding: ${props => props.size === "sm" ? "2px 8px" : "4px 12px"};
  border-radius: 9999px;
  font-size: ${props => props.size === "sm" ? "11px" : "12px"};
  font-weight: 500;

  ${props => {
    switch (props.variant) {
      case "primary":
        return `
          background: ${colors["blue-100"]};
          color: ${colors["blue-700"]};
        `;
      case "success":
        return `
          background: ${colors["green-100"]};
          color: ${colors["green-700"]};
        `;
      case "warning":
        return `
          background: ${colors["yellow-100"]};
          color: ${colors["yellow-700"]};
        `;
      case "error":
        return `
          background: ${colors["red-100"]};
          color: ${colors["red-700"]};
        `;
      default:
        return `
          background: ${colors["gray-100"]};
          color: ${colors["gray-700"]};
        `;
    }
  }}
`;

// ============ CODE ============
export const Code = styled.code`
  background: ${colors["gray-100"]};
  padding: 2px 6px;
  border-radius: 4px;
  font-family: "Fira Code", "Consolas", monospace;
  font-size: 13px;
  color: ${colors["red-600"]};
`;
