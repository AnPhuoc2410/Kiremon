import { useState } from "react";
import QRCode from "qrcode";
import toast from "react-hot-toast";
import {
  getTwoFactorSetup,
  enableTwoFactor,
  disableTwoFactor,
} from "@/config/auth.apis";
import { useAuth } from "@/contexts/AuthContext";

export interface TwoFactorSetupData {
  sharedKey: string;
  qrCodeUri: string;
}

export const use2FA = () => {
  const { updateUser } = useAuth();

  // Enable 2FA states
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorSetupData, setTwoFactorSetupData] =
    useState<TwoFactorSetupData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);

  // Disable 2FA states
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);

  const handleSetup2FA = async () => {
    try {
      const data = await getTwoFactorSetup();
      setTwoFactorSetupData(data);

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(data.qrCodeUri);
      setQrCodeDataUrl(qrDataUrl);

      setShow2FAModal(true);
    } catch (error) {
      console.error("2FA setup error:", error);
      const message =
        (error as any)?.response?.data?.message ||
        "Failed to setup 2FA. Please try again.";
      toast.error(message);
    }
  };

  const handleEnable2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsSettingUp2FA(true);
    try {
      await enableTwoFactor({ code: verificationCode });

      updateUser({ twoFactorEnabled: true });
      setShow2FAModal(false);
      setVerificationCode("");
      toast.success("Two-factor authentication enabled successfully!");

      return true;
    } catch (error) {
      console.error("2FA enable error:", error);
      const message =
        (error as any)?.response?.data?.message ||
        "Invalid code. Please try again.";
      toast.error(message);
      return false;
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!disableCode.trim()) {
      toast.error("Please enter the 6-digit code");
      return;
    }

    if (disableCode.length !== 6) {
      toast.error("Code must be exactly 6 digits");
      return;
    }

    setIsDisabling2FA(true);
    try {
      await disableTwoFactor({ code: disableCode });

      updateUser({ twoFactorEnabled: false });
      setShowDisable2FAModal(false);
      setDisableCode("");
      toast.success("Two-factor authentication disabled successfully!");

      return true;
    } catch (error) {
      console.error("2FA disable error:", error);
      const message =
        (error as any)?.response?.data?.message ||
        "Failed to disable 2FA. Please check your code and try again.";
      toast.error(message);
      return false;
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleCopySecret = () => {
    if (twoFactorSetupData?.sharedKey) {
      navigator.clipboard.writeText(twoFactorSetupData.sharedKey);
      toast.success("Secret key copied to clipboard!");
    }
  };

  const handleClose2FAModal = () => {
    setShow2FAModal(false);
    setVerificationCode("");
    setTwoFactorSetupData(null);
    setQrCodeDataUrl("");
  };

  const handleOpenDisableModal = () => {
    setShowDisable2FAModal(true);
    setDisableCode("");
  };

  const handleCloseDisableModal = () => {
    setShowDisable2FAModal(false);
    setDisableCode("");
  };

  return {
    // Enable 2FA
    show2FAModal,
    twoFactorSetupData,
    qrCodeDataUrl,
    verificationCode,
    setVerificationCode,
    isSettingUp2FA,
    handleSetup2FA,
    handleEnable2FA,
    handleCopySecret,
    handleClose2FAModal,

    // Disable 2FA
    showDisable2FAModal,
    disableCode,
    setDisableCode,
    isDisabling2FA,
    handleDisable2FA,
    handleOpenDisableModal,
    handleCloseDisableModal,
  };
};
