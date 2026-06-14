import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

const panelShadow = "4px 4px 0px #000000";

export const Container = styled.div`
  max-width: ${units.screenSize["xl"]};
  margin: 0 auto;
  padding: 16px 16px 80px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background-color: #F4F6F6;
  min-height: 100vh;
  font-family: "VT323", monospace;
`;

export const Header = styled.div`
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  padding: 16px 24px;
  box-shadow: ${panelShadow};
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;

  h1 {
    font-family: "VT323", monospace;
    font-size: 38px;
    margin: 0;
    color: ${colors["red-600"]};
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1.1;
  }

  p {
    font-family: "VT323", monospace;
    font-size: 18px;
    margin: 2px 0 0;
    color: ${colors["gray-500"]};
  }
`;

export const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "VT323", monospace;
  font-size: 18px;
  color: ${colors["gray-900"]};
  border: 2px solid #000000;
  padding: 4px 12px;
  background: ${colors["gray-50"]};
  box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const Card = styled.div<{ $color: string }>`
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  padding: 12px 16px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 8px;

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .indicator {
    width: 12px;
    height: 12px;
    background-color: ${(props) => props.$color};
    border: 1.5px solid #000000;
    display: inline-block;
  }

  h3 {
    font-family: "VT323", monospace;
    font-size: 20px;
    margin: 0;
    color: ${colors["gray-600"]};
    text-transform: uppercase;
    font-weight: bold;
    line-height: 1;
  }

  .value {
    font-family: "VT323", monospace;
    font-size: 44px;
    font-weight: 900;
    color: ${colors["gray-900"]};
    margin: 0;
    line-height: 1;
    text-align: right;
  }
`;

export const ActionSection = styled.div`
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  padding: 16px 20px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 12px;

  h2 {
    font-family: "VT323", monospace;
    font-size: 24px;
    margin: 0;
    color: ${colors["gray-900"]};
    border-bottom: 2px dashed ${colors["gray-300"]};
    padding-bottom: 6px;
    text-transform: uppercase;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

export const Button = styled.button<{ $variant?: "primary" | "success" | "danger" }>`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 0px;
  border: 3px solid #000000;
  cursor: pointer;
  background: ${(props) => {
    if (props.$variant === "success") return colors["green-300"];
    if (props.$variant === "danger") return colors["red-300"];
    return colors["yellow-300"];
  }};
  color: #000000;
  box-shadow: 3px 3px 0px 0px rgba(0, 0, 0, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  transition: none;

  &:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);
  }

  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: 1px 1px 0px 0px rgba(0, 0, 0, 1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
`;

export const Alert = styled.div<{ $status: "success" | "error" | "info" }>`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 8px 16px;
  border-radius: 0px;
  border: 2px solid #000000;
  background: ${(props) => {
    if (props.$status === "success") return "#ecfdf5";
    if (props.$status === "error") return "#fff1f2";
    return "#eff6ff";
  }};
  color: ${(props) => {
    if (props.$status === "success") return "#065f46";
    if (props.$status === "error") return "#9f1239";
    return "#1e40af";
  }};
`;

export const StatusBadge = styled.span<{ $confirmed: boolean }>`
  border: 1.5px solid #000000;
  padding: 2px 8px;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  display: inline-block;
  background: ${(props) => (props.$confirmed ? "#d1fae5" : "#ffe4e6")};
  color: ${(props) => (props.$confirmed ? "#065f46" : "#9f1239")};
`;

export const TableSection = styled.div`
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  padding: 20px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;

  h2 {
    font-family: "VT323", monospace;
    font-size: 24px;
    margin: 0;
    color: ${colors["gray-900"]};
    border-bottom: 2px dashed ${colors["gray-300"]};
    padding-bottom: 6px;
    text-transform: uppercase;
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  border: 3px solid #000000;
  border-radius: 0px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: "VT323", monospace;
  font-size: 18px;
  text-align: left;

  th, td {
    padding: 12px 16px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
    border-right: none;
  }

  th {
    background: rgba(226, 232, 240, 0.6);
    color: #1e293b;
    font-weight: bold;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border-bottom: 3px solid #000000;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:nth-of-type(even) {
    background: #f8fafc;
  }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #000000;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export const ConfigSection = styled.div`
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  padding: 20px;
  box-shadow: ${panelShadow};
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;

  h2 {
    font-family: "VT323", monospace;
    font-size: 28px;
    margin: 0;
    color: ${colors["gray-900"]};
    border-bottom: 2px dashed #000000;
    padding-bottom: 6px;
    text-transform: uppercase;
  }
`;

export const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 3px solid #000000;
  padding-bottom: 0px;
  margin-bottom: 16px;
  overflow-x: auto;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  font-family: "VT323", monospace;
  font-size: 20px;
  padding: 6px 16px;
  border-radius: 0px;
  border: 3px solid #000000;
  border-bottom: ${(props) => (props.$active ? "3px solid white" : "3px solid #000000")};
  background: ${(props) => (props.$active ? "white" : colors["gray-200"])};
  cursor: pointer;
  margin-bottom: -3px;
  text-transform: uppercase;
  font-weight: bold;
  color: #000000;
  z-index: 10;
  white-space: nowrap;

  &:hover {
    background: ${(props) => (props.$active ? "white" : colors["gray-100"])};
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-family: "VT323", monospace;
  font-size: 18px;
  font-weight: bold;
  color: ${colors["gray-700"]};
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LabelSubtitle = styled.span`
  font-size: 14px;
  color: ${colors["gray-400"]};
  text-transform: none;
`;

export const Input = styled.input`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 6px 12px;
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  color: #000000;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors["yellow-500"]};
    background: #fffff0;
  }
`;

export const Select = styled.select`
  font-family: "VT323", monospace;
  font-size: 18px;
  padding: 6px 12px;
  border: 3px solid #000000;
  border-radius: 0px;
  background: white;
  color: #000000;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${colors["yellow-500"]};
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "VT323", monospace;
  font-size: 18px;
  font-weight: bold;
  color: ${colors["gray-700"]};
  text-transform: uppercase;
  cursor: pointer;
  user-select: none;

  input {
    width: 20px;
    height: 20px;
    border: 3px solid #000000;
    accent-color: #000000;
    cursor: pointer;
  }
`;

export const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
  border: 2px dashed ${colors["gray-300"]};
  padding: 8px;
  min-height: 42px;
  background: ${colors["gray-50"]};
`;

export const TagItem = styled.span<{ $variant?: "type" | "tag" | "id" }>`
  border: 2px solid #000000;
  background: ${(props) => {
    if (props.$variant === "type") return "#ffe4e6"; // red
    if (props.$variant === "id") return "#dbeafe"; // blue
    return "#fef08a"; // yellow
  }};
  color: #000000;
  padding: 2px 8px;
  font-size: 15px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: bold;

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-weight: bold;
    color: ${colors["red-600"]};
    padding: 0;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: ${colors["red-800"]};
    }
  }
`;

export const AddTagWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

