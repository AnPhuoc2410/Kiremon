import React from "react";
import * as S from "../index.style";
import { ShieldIcon, CloseIcon } from "../icons";

interface Disable2FAModalProps {
  show: boolean;
  disableCode: string;
  setDisableCode: (code: string) => void;
  isDisabling: boolean;
  onDisable: () => void;
  onClose: () => void;
}

export const Disable2FAModal: React.FC<Disable2FAModalProps> = ({
  show,
  disableCode,
  setDisableCode,
  isDisabling,
  onDisable,
  onClose,
}) => {
  if (!show) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalHeaderTop>
            <S.ModalTitle>
              <ShieldIcon />
              Disable two-factor authentication
            </S.ModalTitle>
            <S.CloseButton onClick={onClose}>
              <CloseIcon />
            </S.CloseButton>
          </S.ModalHeaderTop>
        </S.ModalHeader>

        <S.ModalBody>
          <S.ModalSection>
            <S.ModalSectionTitle>
              Are you sure you want to disable 2FA?
            </S.ModalSectionTitle>
            <S.ModalSectionDescription>
              Disabling two-factor authentication will make your account less
              secure. You'll only need your password to sign in.
            </S.ModalSectionDescription>

            <S.ModalSectionDescription>
              Please enter the 6-digit code from your authenticator app to
              confirm:
            </S.ModalSectionDescription>
            <S.Input
              type="text"
              placeholder="000000"
              value={disableCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 6) setDisableCode(value);
              }}
              maxLength={6}
              autoFocus
              style={{
                letterSpacing: "6px",
                textAlign: "center",
                fontFamily: "monospace",
                fontSize: "20px",
              }}
            />
          </S.ModalSection>

          <S.ButtonGroup>
            <S.Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </S.Button>
            <S.Button
              onClick={onDisable}
              disabled={isDisabling || disableCode.length !== 6}
              style={{ flex: 1, background: "#dc2626" }}
            >
              {isDisabling ? "Disabling..." : "Disable 2FA"}
            </S.Button>
          </S.ButtonGroup>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
