import styled from "@emotion/styled";
import { colors } from "../../components/utils";

// ============ LAYOUT ============
export const Page = styled.div`
  min-height: calc(100vh - 80px);
  background: white;
  position: relative;
`;

export const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: calc(100vh - 80px);
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// ============ SIDEBAR NAVIGATION ============
export const Sidebar = styled.nav`
  width: 280px;
  background: white;
  border-right: 1px solid ${colors["gray-200"]};
  padding: 0;
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

export const SidebarSection = styled.div`
  &:not(:first-of-type) {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid ${colors["gray-200"]};
  }

  @media (max-width: 1024px) {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }
`;

export const SidebarSectionTitle = styled.div`
  padding: 0 20px 12px;
  font-size: 12px;
  font-weight: 700;
  color: ${colors["gray-500"]};
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 1024px) {
    display: none;
  }
`;

export const SidebarTitle = styled.div`
  padding: 24px 20px 16px;
  font-size: 18px;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;

  svg {
    width: 24px;
    height: 24px;
    color: ${colors["red-500"]};
    display: none;
  }
`;

export const NavItem = styled.button<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border: none;
  background: ${({ active }) =>
    active
      ? `linear-gradient(90deg, ${colors["red-100"]} 0%, transparent 100%)`
      : "transparent"};
  color: ${({ active }) => (active ? colors["red-600"] : colors["gray-600"])};
  font-size: 15px;
  font-weight: ${({ active }) => (active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  border-left: 3px solid
    ${({ active }) => (active ? colors["red-500"] : "transparent")};

  &:hover {
    background: ${({ active }) =>
      active
        ? `linear-gradient(90deg, ${colors["red-100"]} 0%, transparent 100%)`
        : colors["gray-100"]};
    color: ${({ active }) => (active ? colors["red-600"] : colors["gray-800"])};
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  @media (max-width: 1024px) {
    border-left: none;
    border-bottom: 3px solid
      ${(props) => (props.active ? colors["red-500"] : "transparent")};
    padding: 12px 16px;
    white-space: nowrap;
    border-radius: 8px;
    min-width: fit-content;
  }
`;

export const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
  background: white;
  min-height: calc(100vh - 80px);\n\n  @media (max-width: 768px) {\n    min-height: auto;\n  }\n`;

export const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 1px solid ${colors["gray-200"]};\n  background: white;
  position: sticky;
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

export const ContentTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin: 0;
`;

export const ContentDescription = styled.p`
  font-size: 15px;
  color: ${colors["gray-600"]};
  margin: 0;
  line-height: 1.6;
`;

export const Section = styled.section`
  scroll-margin-top: 140px;
  background: white;
  padding: 24px 32px;
  position: relative;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors["gray-200"]};
  }

  @media (max-width: 768px) {
    scroll-margin-top: 120px;
    padding: 20px;
  }
`;

export const SectionHeader = styled.div`
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: ${colors["gray-800"]};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    width: 18px;
    height: 18px;
    color: ${colors["gray-500"]};
  }
`;

// ============ SECTION DIVIDER ============
export const SectionBody = styled.div`
  padding: 0;
`;

export const EmptyState = styled.div`
  padding: 80px 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: ${colors["gray-100"]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors["gray-400"]};
  margin-bottom: 8px;

  svg {
    width: 32px;
    height: 32px;
  }
`;

export const EmptyStateTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: ${colors["gray-900"]};
  margin: 0;
`;

export const EmptyStateDescription = styled.p`
  font-size: 14px;
  color: ${colors["gray-600"]};
  margin: 0 0 24px 0;
  max-width: 600px;
  line-height: 1.6;
`;

export const EmptyStateButton = styled.button`
  padding: 12px 24px;
  background: ${colors["green-600"]};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["green-700"]};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

// ============ SETTINGS ITEMS ============
export const SettingItem = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${colors["gray-100"]};
  gap: 24px;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
    padding: 16px 0;
  }
`;

export const SettingItemMain = styled.div`
  flex: 1;
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

export const SettingItemIcon = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: ${(props) => props.color || colors["red-100"]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.color?.replace("50", "600") || colors["red-600"]};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const SettingItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SettingItemTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: ${colors["gray-900"]};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const SettingItemDescription = styled.div`
  font-size: 14px;
  color: ${colors["gray-600"]};
  line-height: 1.5;
`;

export const SettingItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }
`;

// ============ BUTTONS ============
export const Button = styled.button<{
  variant?: "primary" | "secondary" | "danger";
}>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  ${(props) => {
    if (props.variant === "danger") {
      return `
        background: ${colors["red-500"]};
        color: white;
        &:hover:not(:disabled) {
          background: ${colors["red-600"]};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
      `;
    } else if (props.variant === "secondary") {
      return `
        background: ${colors["gray-100"]};
        color: ${colors["gray-700"]};
        &:hover:not(:disabled) {
          background: ${colors["gray-200"]};
        }
      `;
    } else {
      return `
        background: ${colors["red-500"]};
        color: white;
        &:hover:not(:disabled) {
          background: ${colors["red-600"]};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
      `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// ============ TOGGLE SWITCH ============
export const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 56px;
  height: 30px;
`;

export const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${colors["green-500"]};
  }

  &:checked + span:before {
    transform: translateX(26px);
  }
`;

export const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${colors["gray-300"]};
  transition: 0.3s;
  border-radius: 30px;

  &:before {
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

// ============ 2FA MODAL ============
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
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  border: 2px solid ${colors["gray-200"]};
`;

export const ModalHeader = styled.div`
  padding: 32px 32px 24px;
  background: white;
  color: ${colors["gray-900"]};
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-bottom: 1px solid ${colors["gray-200"]};
`;

export const ModalHeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ModalTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;

  svg {
    color: ${colors["red-500"]};
  }
`;

export const ProgressSteps = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

export const ProgressStep = styled.div<{
  active?: boolean;
  completed?: boolean;
}>`
  display: flex;
  align-items: center;

  &:not(:last-child)::after {
    content: "";
    width: 60px;
    height: 2px;
    background: ${(props) =>
      props.completed ? colors["red-500"] : colors["gray-300"]};
    margin: 0 12px;
  }
`;

export const StepCircle = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.active) {
      return `
        background: ${colors["red-500"]};
        color: white;
        box-shadow: 0 0 0 4px ${colors["red-100"]};
      `;
    } else if (props.completed) {
      return `
        background: ${colors["red-500"]};
        color: white;
      `;
    } else {
      return `
        background: ${colors["gray-200"]};
        color: ${colors["gray-600"]};
        border: 2px solid ${colors["gray-300"]};
      `;
    }
  }}
`;

export const CloseButton = styled.button`
  background: ${colors["gray-100"]};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: ${colors["gray-600"]};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${colors["red-500"]};
    color: white;
    transform: rotate(90deg);
  }
`;

export const ModalBody = styled.div`
  padding: 32px;
  max-height: 70vh;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${colors["gray-100"]};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${colors["red-400"]};
    border-radius: 4px;
  }
`;

export const ModalSection = styled.div`
  margin-bottom: 32px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ModalSectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin: 0 0 8px 0;
`;

export const ModalSectionDescription = styled.p`
  font-size: 14px;
  color: ${colors["gray-600"]};
  margin: 0 0 16px 0;
  line-height: 1.6;
`;

export const QRCodeContainer = styled.div`
  background: white;
  border: 2px solid ${colors["gray-200"]};
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0;
`;

export const QRCodeWrapper = styled.div`
  background: white;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 200px;
    height: 200px;
  }
`;

export const QRCodeHelp = styled.div`
  margin-top: 16px;
  font-size: 13px;
  color: ${colors["gray-600"]};
  text-align: center;

  a {
    color: ${colors["red-500"]};
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SecretKeyContainer = styled.div`
  background: ${colors["gray-100"]};
  border: 1px solid ${colors["gray-200"]};
  border-radius: 8px;
  padding: 12px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SecretKey = styled.code`
  font-family: "Consolas", "Monaco", "Courier New", monospace;
  font-size: 13px;
  color: ${colors["gray-900"]};
  font-weight: 600;
  flex: 1;
  word-break: break-all;
  letter-spacing: 1px;
`;

export const CopyButton = styled.button`
  background: transparent;
  color: ${colors["gray-600"]};
  border: 1px solid ${colors["gray-300"]};
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: ${colors["gray-100"]};
    border-color: ${colors["gray-400"]};
  }

  &:active {
    background: ${colors["gray-200"]};
  }
`;

export const VerificationSection = styled.div`
  margin-top: 24px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid ${colors["gray-300"]};
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.2s ease;
  font-family: "Consolas", "Monaco", monospace;
  letter-spacing: 8px;
  font-weight: 600;
  text-align: center;

  &::placeholder {
    letter-spacing: 2px;
    color: ${colors["gray-400"]};
  }

  &:focus {
    outline: none;
    border-color: ${colors["red-500"]};
    box-shadow: 0 0 0 3px ${colors["red-100"]};
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: ${colors["gray-700"]};
  margin-bottom: 8px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${colors["gray-200"]};

  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

// ============ STATUS BADGE ============
export const StatusBadge = styled.span<{ active?: boolean }>`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  ${(props) =>
    props.active
      ? `
    background: ${colors["green-100"]};
    color: ${colors["green-700"]};
  `
      : `
    background: ${colors["gray-100"]};
    color: ${colors["gray-600"]};
  `}
`;
