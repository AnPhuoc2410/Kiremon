import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

const panelShadow = "4px 4px 0px #111827";

export const Container = styled.div`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 24px 16px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Header = styled.div`
  border: 4px solid ${colors["gray-900"]};
  border-radius: 12px;
  background: white;
  padding: 24px;
  box-shadow: ${panelShadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  h1 {
    font-family: "VT323", monospace;
    font-size: 42px;
    margin: 0;
    color: ${colors["red-600"]};
    text-shadow: 2px 2px 0px ${colors["gray-200"]};
  }

  p {
    font-family: "VT323", monospace;
    font-size: 20px;
    margin: 4px 0 0;
    color: ${colors["gray-500"]};
  }
`;

export const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "VT323", monospace;
  font-size: 20px;
  color: ${colors["gray-900"]};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
`;

export const Card = styled.div<{ $color: string }>`
  border: 3px solid ${colors["gray-900"]};
  border-radius: 12px;
  background: white;
  padding: 20px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 10px solid ${(props) => props.$color};

  h3 {
    font-family: "VT323", monospace;
    font-size: 22px;
    margin: 0;
    color: ${colors["gray-500"]};
    text-transform: uppercase;
  }

  .value {
    font-family: "VT323", monospace;
    font-size: 48px;
    font-weight: bold;
    color: ${colors["gray-900"]};
    margin: 0;
    line-height: 1;
  }
`;

export const ActionSection = styled.div`
  border: 3px solid ${colors["gray-900"]};
  border-radius: 12px;
  background: white;
  padding: 24px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 16px;

  h2 {
    font-family: "VT323", monospace;
    font-size: 28px;
    margin: 0;
    color: ${colors["gray-900"]};
    border-bottom: 2px dashed ${colors["gray-300"]};
    padding-bottom: 8px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: "primary" | "success" | "danger" }>`
  font-family: "VT323", monospace;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 8px;
  border: 3px solid ${colors["gray-900"]};
  cursor: pointer;
  background: ${(props) => {
    if (props.$variant === "success") return colors["green-300"];
    if (props.$variant === "danger") return colors["red-300"];
    return colors["yellow-300"];
  }};
  color: ${colors["gray-900"]};
  box-shadow: inset -4px -4px 0px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 2px 2px 0px ${colors["gray-900"]}, inset -4px -4px 0px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Alert = styled.div<{ $status: "success" | "error" | "info" }>`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid ${colors["gray-900"]};
  background: ${(props) => {
    if (props.$status === "success") return colors["green-100"];
    if (props.$status === "error") return colors["red-100"];
    return colors["blue-100"];
  }};
  color: ${(props) => {
    if (props.$status === "success") return colors["green-800"];
    if (props.$status === "error") return colors["red-800"];
    return colors["blue-800"];
  }};
`;

export const TableSection = styled.div`
  border: 3px solid ${colors["gray-900"]};
  border-radius: 12px;
  background: white;
  padding: 24px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow: hidden;

  h2 {
    font-family: "VT323", monospace;
    font-size: 28px;
    margin: 0;
    color: ${colors["gray-900"]};
    border-bottom: 2px dashed ${colors["gray-300"]};
    padding-bottom: 8px;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 2px solid ${colors["gray-900"]};
  border-radius: 8px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "VT323", monospace;
  font-size: 18px;
  text-align: left;

  th, td {
    padding: 12px;
    border-bottom: 1px solid ${colors["gray-200"]};
    border-right: 1px solid ${colors["gray-200"]};
  }

  th {
    background: ${colors["gray-100"]};
    color: ${colors["gray-700"]};
    font-weight: bold;
    border-bottom: 2px solid ${colors["gray-900"]};
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:nth-of-type(even) {
    background: ${colors["gray-50"]};
  }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: ${colors["gray-900"]};
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
