import React from "react";
import * as S from "@/pages/Settings/index.style";
import { CloseIcon, CopyIcon } from "@/pages/Settings/icons";
import { TwoFactorSetupData } from "@/pages/Settings/hooks/use2FA";

interface Enable2FAModalProps {
  show: boolean;
  qrCodeDataUrl: string;
  twoFactorSetupData: TwoFactorSetupData | null;
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  isSettingUp: boolean;
  onEnable: () => void;
  onClose: () => void;
  onCopySecret: () => void;
}

export const Enable2FAModal: React.FC<Enable2FAModalProps> = ({
  show,
  qrCodeDataUrl,
  twoFactorSetupData,
  verificationCode,
  setVerificationCode,
  isSettingUp,
  onEnable,
  onClose,
  onCopySecret,
}) => {
  if (!show) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalHeaderTop>
            <S.ModalTitle>Enable two-factor authentication (2FA)</S.ModalTitle>
            <S.CloseButton onClick={onClose}>
              <CloseIcon />
            </S.CloseButton>
          </S.ModalHeaderTop>

          <S.ProgressSteps>
            <S.ProgressStep active completed>
              <S.StepCircle active>1</S.StepCircle>
            </S.ProgressStep>
            <S.ProgressStep>
              <S.StepCircle>2</S.StepCircle>
            </S.ProgressStep>
            <S.ProgressStep>
              <S.StepCircle>3</S.StepCircle>
            </S.ProgressStep>
          </S.ProgressSteps>
        </S.ModalHeader>

        <S.ModalBody>
          <S.ModalSection>
            <S.ModalSectionTitle>Setup authenticator app</S.ModalSectionTitle>
            <S.ModalSectionDescription>
              Authenticator apps and browser extensions like{" "}
              <strong>Google Authenticator</strong>,{" "}
              <strong>Microsoft Authenticator</strong>, or{" "}
              <strong>Authy</strong> generate one-time passwords that are used
              as a second factor to verify your identity when prompted during
              sign-in.
            </S.ModalSectionDescription>

            <S.ModalSectionTitle>Scan the QR code</S.ModalSectionTitle>
            <S.ModalSectionDescription>
              Use an authenticator app or browser extension to scan.
            </S.ModalSectionDescription>

            {qrCodeDataUrl && (
              <S.QRCodeContainer>
                <S.QRCodeWrapper>
                  <img src={qrCodeDataUrl} alt="2FA QR Code" />
                </S.QRCodeWrapper>
                <S.QRCodeHelp>
                  Unable to scan?{" "}
                  <button type="button">
                    You can use the setup key to manually configure your
                    authenticator app.
                  </button>
                </S.QRCodeHelp>
              </S.QRCodeContainer>
            )}

            {twoFactorSetupData && (
              <S.SecretKeyContainer>
                <S.SecretKey>{twoFactorSetupData.sharedKey}</S.SecretKey>
                <S.CopyButton onClick={onCopySecret}>
                  <CopyIcon />
                  Copy
                </S.CopyButton>
              </S.SecretKeyContainer>
            )}
          </S.ModalSection>

          <S.ModalSection>
            <S.ModalSectionTitle>
              Verify the code from the app
            </S.ModalSectionTitle>
            <S.Input
              type="text"
              placeholder="XXXXXX"
              value={verificationCode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setVerificationCode(value);
              }}
              maxLength={6}
              autoFocus
            />
          </S.ModalSection>

          <S.ButtonGroup>
            <S.Button variant="secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancel
            </S.Button>
            <S.Button
              onClick={onEnable}
              disabled={isSettingUp || verificationCode.length !== 6}
              style={{ flex: 1 }}
            >
              {isSettingUp ? "Verifying..." : "Continue"}
            </S.Button>
          </S.ButtonGroup>
        </S.ModalBody>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};
