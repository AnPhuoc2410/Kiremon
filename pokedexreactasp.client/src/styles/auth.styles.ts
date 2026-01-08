import styled from "@emotion/styled";
import { colors } from "../components/utils";
import { GradientPage, FlexRow, FlexColumn } from "./layout.styles";
import { AuthCard as BaseAuthCard } from "./card.styles";

// ============ AUTH PAGE LAYOUT ============
export const AuthPage = styled(GradientPage)`
  min-height: calc(100vh - 120px);
`;

export const AuthContainer = styled(FlexColumn)`
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 2px;
`;

// ============ AUTH CARD (re-export with auth-specific defaults) ============
export const AuthCard = styled(BaseAuthCard)``;

export const AuthHeader = styled(FlexRow)`
  gap: 12px;
  margin-bottom: 8px;
`;

export const AuthLogo = styled.img`
  width: 40px;
  height: 40px;
  display: block;
`;

export const AuthTitle = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.35rem;
  color: ${colors["gray-900"]};
  letter-spacing: 0.4px;
`;

export const AuthSubtitle = styled.p`
  margin: 0 0 16px 0;
  color: ${colors["gray-600"]};
  font-size: 14px;
`;

// ============ AUTH FORM ============
export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AuthInput = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${colors["gray-300"]};
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: ${colors["blue-500"]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
  }
`;

export const AuthSubmit = styled.button`
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${colors["blue-600"]};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${colors["blue-700"]};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// ============ SOCIAL LOGIN ============
export const AuthDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 12px 0;
  color: ${colors["gray-400"]};
  font-size: 13px;

  &::before,
  &::after {
    content: "";
    flex: 1 1 auto;
    height: 1px;
    background: ${colors["gray-200"]};
    border-radius: 1px;
  }
`;

export const SocialButton = styled.button<{
  $provider?: "google" | "facebook" | "github";
}>`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${colors["gray-200"]};
  background: white;
  color: ${colors["gray-800"]};
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  transition:
    box-shadow 120ms ease,
    transform 120ms ease;
  width: 100%;

  &:hover {
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SocialButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ============ AUTH FOOTER ============
export const AuthFooter = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: ${colors["gray-600"]};
  display: flex;
  justify-content: space-between;
`;

export const AuthRow = styled(FlexRow)`
  justify-content: space-between;
  gap: 12px;
`;

export const AuthSmallText = styled.small`
  color: ${colors["gray-500"]};
  font-size: 13px;
`;

export const AuthLink = styled.a`
  color: ${colors["blue-600"]};
  text-decoration: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// ============ CHECKBOX ============
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${colors["gray-600"]};
  cursor: pointer;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${colors["blue-600"]};
  }
`;

// ============ TWO FACTOR AUTH ============
export const TwoFactorContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: center;
`;

export const TwoFactorInput = styled(AuthInput)`
  text-align: center;
  font-size: 24px;
  letter-spacing: 8px;
  font-weight: 600;
`;

// ============ ERROR / SUCCESS MESSAGES ============
export const AuthMessage = styled.div<{ $type?: "error" | "success" | "info" }>`
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;

  ${(props) => {
    switch (props.$type) {
      case "error":
        return `
          background: ${colors["red-500"]};
          color: ${colors["red-700"]};
          border: 1px solid ${colors["red-200"]};
        `;
      case "success":
        return `
          background: ${colors["green-500"]};
          color: ${colors["green-700"]};
          border: 1px solid ${colors["green-200"]};
        `;
      default:
        return `
          background: ${colors["blue-500"]};
          color: ${colors["blue-700"]};
          border: 1px solid ${colors["blue-200"]};
        `;
    }
  }}
`;

// ============ PASSWORD FIELD WITH TOGGLE ============
export const PasswordWrapper = styled.div`
  position: relative;
`;

export const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors["gray-400"]};
  padding: 4px;
  display: flex;
  align-items: center;

  &:hover {
    color: ${colors["gray-600"]};
  }
`;

export const PasswordInput = styled(AuthInput)`
  padding-right: 44px;
`;
