import styled from "@emotion/styled";
import { colors } from "../components/utils";

// ============ FORM WRAPPER ============
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const FormGroup = styled.div<{ inline?: boolean }>`
  display: flex;
  flex-direction: ${props => props.inline ? "row" : "column"};
  gap: 8px;

  ${props => props.inline && `
    align-items: center;
    flex-wrap: wrap;
  `}
`;

// ============ FORM INPUTS ============
export const FormInput = styled.input<{
  hasError?: boolean;
  $size?: "sm" | "md" | "lg";
}>`
  padding: ${({ $size = "md" }) => {
    switch ($size) {
      case "sm": return "8px 10px";
      case "lg": return "14px 16px";
      default: return "10px 12px";
    }
  }};
  border-radius: 8px;
  border: 1px solid ${props => props.hasError ? colors["red-500"] : colors["gray-300"]};
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${props => props.hasError ? colors["red-500"] : colors["blue-500"]};
    box-shadow: 0 0 0 3px ${props => props.hasError
      ? "rgba(239, 68, 68, 0.1)"
      : "rgba(59, 130, 246, 0.06)"
    };
  }

  &::placeholder {
    color: ${colors["gray-400"]};
  }

  &:disabled {
    background: ${colors["gray-100"]};
    cursor: not-allowed;
  }
`;

export const FormTextarea = styled.textarea<{ hasError?: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.hasError ? colors["red-500"] : colors["gray-300"]};
  outline: none;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${props => props.hasError ? colors["red-500"] : colors["blue-500"]};
    box-shadow: 0 0 0 3px ${props => props.hasError
      ? "rgba(239, 68, 68, 0.1)"
      : "rgba(59, 130, 246, 0.06)"
    };
  }
`;

export const FormSelect = styled.select<{ hasError?: boolean }>`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.hasError ? colors["red-500"] : colors["gray-300"]};
  outline: none;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    border-color: ${colors["blue-500"]};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
  }
`;

// ============ FORM BUTTONS ============
export const SubmitButton = styled.button<{
  $variant?: "primary" | "secondary" | "danger" | "success";
  $size?: "sm" | "md" | "lg";
  $fullWidth?: boolean;
}>`
  padding: ${({ $size = "md" }) => {
    switch ($size) {
      case "sm": return "8px 12px";
      case "lg": return "14px 20px";
      default: return "10px 16px";
    }
  }};
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  width: ${({ $fullWidth }) => $fullWidth ? "100%" : "auto"};

  ${({ $variant = "primary" }) => {
    switch ($variant) {
      case "secondary":
        return `
          background: ${colors["gray-200"]};
          color: ${colors["gray-800"]};
          &:hover { background: ${colors["gray-300"]}; }
        `;
      case "danger":
        return `
          background: ${colors["red-600"]};
          color: white;
          &:hover { background: ${colors["red-700"]}; }
        `;
      case "success":
        return `
          background: ${colors["green-600"]};
          color: white;
          &:hover { background: ${colors["green-700"]}; }
        `;
      default:
        return `
          background: ${colors["blue-600"]};
          color: white;
          &:hover { background: ${colors["blue-700"]}; }
        `;
    }
  }}

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// ============ FORM LABELS ============
export const FormLabel = styled.label<{ required?: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${colors["gray-700"]};

  ${props => props.required && `
    &::after {
      content: " *";
      color: ${colors["red-500"]};
    }
  `}
`;

export const FormError = styled.span`
  font-size: 12px;
  color: ${colors["red-500"]};
`;

export const FormHelperText = styled.span`
  font-size: 12px;
  color: ${colors["gray-500"]};
`;

// ============ INPUT WITH ICON ============
export const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const InputIcon = styled.span<{ position?: "left" | "right" }>`
  position: absolute;
  ${props => props.position === "right" ? "right: 12px;" : "left: 12px;"}
  color: ${colors["gray-400"]};
  display: flex;
  align-items: center;
`;

export const InputWithLeftIcon = styled(FormInput)`
  padding-left: 40px;
`;

export const InputWithRightIcon = styled(FormInput)`
  padding-right: 40px;
`;
