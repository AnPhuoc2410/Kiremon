import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import {
  getTwoFactorSetup,
  enableTwoFactor,
  disableTwoFactor,
} from "../../config/auth.apis";
import * as S from "./index.style";
import toast from "react-hot-toast";
import QRCode from "qrcode";

// Icons
const ShieldIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 0L2.5 3.33333V8.33333C2.5 12.9583 5.65 17.3083 10 18.3333C14.35 17.3083 17.5 12.9583 17.5 8.33333V3.33333L10 0Z"
      fill="currentColor"
    />
  </svg>
);

const KeyIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.5 12.5C9.57107 12.5 11.25 10.8211 11.25 8.75C11.25 6.67893 9.57107 5 7.5 5C5.42893 5 3.75 6.67893 3.75 8.75C3.75 10.8211 5.42893 12.5 7.5 12.5Z"
      fill="currentColor"
    />
    <path
      d="M11.25 8.75L16.25 3.75L15 2.5L13.75 3.75L12.5 2.5L11.25 3.75"
      fill="currentColor"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
      fill="currentColor"
    />
    <path
      d="M10 11.6667C5.8325 11.6667 2.5 14.1083 2.5 17.0833C2.5 17.775 3.05833 18.3333 3.75 18.3333H16.25C16.9417 18.3333 17.5 17.775 17.5 17.0833C17.5 14.1083 14.1675 11.6667 10 11.6667Z"
      fill="currentColor"
    />
  </svg>
);

const BellIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 6.66667C15 5.34058 14.4732 4.06881 13.5355 3.13113C12.5979 2.19345 11.3261 1.66667 10 1.66667C8.67392 1.66667 7.40215 2.19345 6.46447 3.13113C5.52678 4.06881 5 5.34058 5 6.66667C5 12.5 2.5 14.1667 2.5 14.1667H17.5C17.5 14.1667 15 12.5 15 6.66667Z"
      fill="currentColor"
    />
    <path
      d="M11.4417 17.5C11.2952 17.7526 11.085 17.9622 10.8319 18.1079C10.5787 18.2537 10.2918 18.3304 10 18.3304C9.70824 18.3304 9.42127 18.2537 9.16814 18.1079C8.91501 17.9622 8.70484 17.7526 8.55833 17.5"
      fill="currentColor"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.3333 4L6 11.3333L2.66666 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M15 5L5 15M5 5L15 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect
      x="5"
      y="5"
      width="9"
      height="9"
      rx="1"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M3 11H2C1.44772 11 1 10.5523 1 10V2C1 1.44772 1.44772 1 2 1H10C10.5523 1 11 1.44772 11 2V3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

interface TwoFactorSetupData {
  sharedKey: string;
  qrCodeUri: string;
}

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("security");

  // 2FA states
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    user?.twoFactorEnabled || false,
  );
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFactorSetupData, setTwoFactorSetupData] =
    useState<TwoFactorSetupData | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSettingUp2FA, setIsSettingUp2FA] = useState(false);

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Update 2FA status from user object
    if (user?.twoFactorEnabled !== undefined) {
      setTwoFactorEnabled(user.twoFactorEnabled);
    }
  }, [user]);

  // Scroll spy effect
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["security", "account", "notifications"];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 140;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  const handleSetup2FA = async () => {
    setLoading(true);
    try {
      const data = await getTwoFactorSetup();
      setTwoFactorSetupData(data);

      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(data.qrCodeUri);
      setQrCodeDataUrl(qrDataUrl);

      setShow2FAModal(true);
    } catch (error: any) {
      console.error("2FA setup error:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to setup 2FA. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
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

      setTwoFactorEnabled(true);
      updateUser({ twoFactorEnabled: true });
      setShow2FAModal(false);
      setVerificationCode("");
      toast.success("Two-factor authentication enabled successfully!");
    } catch (error: any) {
      console.error("2FA enable error:", error);
      const message =
        error?.response?.data?.message || "Invalid code. Please try again.";
      toast.error(message);
    } finally {
      setIsSettingUp2FA(false);
    }
  };

  const handleDisable2FA = async () => {
    if (
      !confirm("Are you sure you want to disable two-factor authentication?")
    ) {
      return;
    }

    setLoading(true);
    try {
      await disableTwoFactor();

      setTwoFactorEnabled(false);
      updateUser({ twoFactorEnabled: false });
      toast.success("Two-factor authentication disabled");
    } catch (error: any) {
      console.error("2FA disable error:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to disable 2FA. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
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

  return (
    <S.Page>
      <Header
        title="Settings"
        subtitle="Manage your account preferences"
        backTo="/profile"
      />

      <S.Container>
        {/* Sidebar Navigation */}
        <S.Sidebar>
          <S.SidebarTitle>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 5V11C4 16.55 7.84 21.74 12 23C16.16 21.74 20 16.55 20 11V5L12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            Settings
          </S.SidebarTitle>

          <S.SidebarSection>
            <S.SidebarSectionTitle>Account</S.SidebarSectionTitle>
            <S.NavItem
              active={activeSection === "account"}
              onClick={() => scrollToSection("account")}
            >
              <UserIcon />
              <span>Account</span>
            </S.NavItem>

            <S.NavItem
              active={activeSection === "notifications"}
              onClick={() => scrollToSection("notifications")}
            >
              <BellIcon />
              <span>Notifications</span>
            </S.NavItem>
          </S.SidebarSection>

          <S.SidebarSection>
            <S.SidebarSectionTitle>Access</S.SidebarSectionTitle>
            <S.NavItem
              active={activeSection === "security"}
              onClick={() => scrollToSection("security")}
            >
              <ShieldIcon />
              <span>Password and authentication</span>
            </S.NavItem>
          </S.SidebarSection>
        </S.Sidebar>

        {/* Content Area */}
        <S.ContentArea>
          <S.ContentHeader>
            <S.ContentTitle>Account settings</S.ContentTitle>
            <S.ContentDescription>
              Manage your account information and preferences.
            </S.ContentDescription>
          </S.ContentHeader>

          {/* Account Section */}
          <S.Section id="account">
            <S.SectionHeader>
              <S.SectionTitle>
                <UserIcon />
                Account settings
              </S.SectionTitle>
            </S.SectionHeader>

            <S.SettingItem>
              <S.SettingItemMain>
                <S.SettingItemIcon>
                  <UserIcon />
                </S.SettingItemIcon>
                <S.SettingItemContent>
                  <S.SettingItemTitle>Profile Information</S.SettingItemTitle>
                  <S.SettingItemDescription>
                    Update your personal information, including your name,
                    email, and avatar.
                  </S.SettingItemDescription>
                </S.SettingItemContent>
              </S.SettingItemMain>
              <S.SettingItemActions>
                <S.Button
                  variant="secondary"
                  onClick={() => navigate("/profile")}
                >
                  Edit
                </S.Button>
              </S.SettingItemActions>
            </S.SettingItem>

            <S.SettingItem>
              <S.SettingItemMain>
                <S.SettingItemIcon>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 5.83333C2.5 5.17029 2.76339 4.53441 3.23223 4.06557C3.70107 3.59673 4.33696 3.33333 5 3.33333H15C15.663 3.33333 16.2989 3.59673 16.7678 4.06557C17.2366 4.53441 17.5 5.17029 17.5 5.83333V14.1667C17.5 14.8297 17.2366 15.4656 16.7678 15.9344C16.2989 16.4033 15.663 16.6667 15 16.6667H5C4.33696 16.6667 3.70107 16.4033 3.23223 15.9344C2.76339 15.4656 2.5 14.8297 2.5 14.1667V5.83333Z"
                      fill="currentColor"
                    />
                    <path
                      d="M2.5 5.83333L10 10.8333L17.5 5.83333"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.SettingItemIcon>
                <S.SettingItemContent>
                  <S.SettingItemTitle>Email Address</S.SettingItemTitle>
                  <S.SettingItemDescription>
                    {user?.email || "Not set"}
                  </S.SettingItemDescription>
                </S.SettingItemContent>
              </S.SettingItemMain>
              <S.SettingItemActions>
                <S.Button variant="secondary">Change</S.Button>
              </S.SettingItemActions>
            </S.SettingItem>
          </S.Section>

          {/* Notifications Section */}
          <S.Section id="notifications">
            <S.SectionHeader>
              <S.SectionTitle>
                <BellIcon />
                Notifications
              </S.SectionTitle>
            </S.SectionHeader>

            <S.SettingItem>
              <S.SettingItemMain>
                <S.SettingItemIcon>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M2.5 5.83333C2.5 5.17029 2.76339 4.53441 3.23223 4.06557C3.70107 3.59673 4.33696 3.33333 5 3.33333H15C15.663 3.33333 16.2989 3.59673 16.7678 4.06557C17.2366 4.53441 17.5 5.17029 17.5 5.83333V14.1667C17.5 14.8297 17.2366 15.4656 16.7678 15.9344C16.2989 16.4033 15.663 16.6667 15 16.6667H5C4.33696 16.6667 3.70107 16.4033 3.23223 15.9344C2.76339 15.4656 2.5 14.8297 2.5 14.1667V5.83333Z"
                      fill="currentColor"
                    />
                    <path
                      d="M2.5 5.83333L10 10.8333L17.5 5.83333"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.SettingItemIcon>
                <S.SettingItemContent>
                  <S.SettingItemTitle>Email Notifications</S.SettingItemTitle>
                  <S.SettingItemDescription>
                    Receive updates about your Pokémon collection and game
                    events via email.
                  </S.SettingItemDescription>
                </S.SettingItemContent>
              </S.SettingItemMain>
              <S.SettingItemActions>
                <S.ToggleSwitch>
                  <S.ToggleInput
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <S.ToggleSlider />
                </S.ToggleSwitch>
              </S.SettingItemActions>
            </S.SettingItem>

            <S.SettingItem>
              <S.SettingItemMain>
                <S.SettingItemIcon>
                  <BellIcon />
                </S.SettingItemIcon>
                <S.SettingItemContent>
                  <S.SettingItemTitle>Push Notifications</S.SettingItemTitle>
                  <S.SettingItemDescription>
                    Get notified about new Pokémon discoveries and important
                    updates.
                  </S.SettingItemDescription>
                </S.SettingItemContent>
              </S.SettingItemMain>
              <S.SettingItemActions>
                <S.ToggleSwitch>
                  <S.ToggleInput
                    type="checkbox"
                    checked={pushNotifications}
                    onChange={(e) => setPushNotifications(e.target.checked)}
                  />
                  <S.ToggleSlider />
                </S.ToggleSwitch>
              </S.SettingItemActions>
            </S.SettingItem>
          </S.Section>

          {/* Security Section */}
          <S.Section id="security">
            <S.SectionHeader>
              <S.SectionTitle>
                <ShieldIcon />
                Two-factor authentication
              </S.SectionTitle>
            </S.SectionHeader>

            {!twoFactorEnabled ? (
              <S.EmptyState>
                <S.EmptyStateIcon>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6 8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V9H19C20.1046 9 21 9.89543 21 11V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V11C3 9.89543 3.89543 9 5 9H6V8ZM16 8V9H8V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8Z"
                      fill="currentColor"
                    />
                  </svg>
                </S.EmptyStateIcon>
                <S.EmptyStateTitle>
                  Two-factor authentication is not enabled yet.
                </S.EmptyStateTitle>
                <S.EmptyStateDescription>
                  Two-factor authentication adds an additional layer of security
                  to your account by requiring more than just a password to sign
                  in.
                </S.EmptyStateDescription>
                <S.EmptyStateButton onClick={handleSetup2FA} disabled={loading}>
                  {loading ? "Loading..." : "Enable two-factor authentication"}
                </S.EmptyStateButton>
              </S.EmptyState>
            ) : (
              <S.SettingItem>
                <S.SettingItemMain>
                  <S.SettingItemIcon>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M10 0L2.5 3.33333V8.33333C2.5 12.9583 5.65 17.3083 10 18.3333C14.35 17.3083 17.5 12.9583 17.5 8.33333V3.33333L10 0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </S.SettingItemIcon>
                  <S.SettingItemContent>
                    <S.SettingItemTitle>
                      Authenticator app
                      <S.StatusBadge active>Configured</S.StatusBadge>
                    </S.SettingItemTitle>
                    <S.SettingItemDescription>
                      Use an authentication app or browser extension to get
                      two-factor authentication codes when prompted.
                    </S.SettingItemDescription>
                  </S.SettingItemContent>
                </S.SettingItemMain>
                <S.SettingItemActions>
                  <S.Button
                    variant="secondary"
                    onClick={handleDisable2FA}
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Edit"}
                  </S.Button>
                </S.SettingItemActions>
              </S.SettingItem>
            )}
          </S.Section>
        </S.ContentArea>
      </S.Container>

      {/* 2FA Setup Modal */}
      {show2FAModal && (
        <S.ModalOverlay onClick={handleClose2FAModal}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <S.ModalTitle>
                <ShieldIcon />
                Enable 2FA
              </S.ModalTitle>
              <S.CloseButton onClick={handleClose2FAModal}>
                <CloseIcon />
              </S.CloseButton>
            </S.ModalHeader>
            <S.ModalBody>
              <S.InfoBox type="info">
                <div>
                  <strong>Setup Instructions:</strong>
                  <br />
                  1. Install Google Authenticator or similar app
                  <br />
                  2. Scan the QR code or enter the secret key manually
                  <br />
                  3. Enter the 6-digit code to verify
                </div>
              </S.InfoBox>

              {qrCodeDataUrl && (
                <S.QRCodeContainer>
                  <S.QRCodeWrapper>
                    <img
                      src={qrCodeDataUrl}
                      alt="2FA QR Code"
                      style={{ display: "block" }}
                    />
                  </S.QRCodeWrapper>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6B7280",
                      textAlign: "center",
                    }}
                  >
                    Scan this QR code with your authenticator app
                  </div>
                </S.QRCodeContainer>
              )}

              {twoFactorSetupData && (
                <>
                  <S.Label>Or enter this secret key manually:</S.Label>
                  <S.SecretKeyContainer>
                    <S.SecretKey>{twoFactorSetupData.sharedKey}</S.SecretKey>
                    <S.CopyButton onClick={handleCopySecret}>
                      <CopyIcon />
                      Copy
                    </S.CopyButton>
                  </S.SecretKeyContainer>
                </>
              )}

              <div style={{ marginTop: "24px" }}>
                <S.Label>Enter verification code:</S.Label>
                <S.Input
                  type="text"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    setVerificationCode(value);
                  }}
                  maxLength={6}
                  autoFocus
                />
              </div>

              <S.ButtonGroup>
                <S.Button
                  variant="secondary"
                  onClick={handleClose2FAModal}
                  style={{ flex: 1 }}
                >
                  Cancel
                </S.Button>
                <S.Button
                  onClick={handleEnable2FA}
                  disabled={isSettingUp2FA || verificationCode.length !== 6}
                  style={{ flex: 1 }}
                >
                  {isSettingUp2FA ? "Verifying..." : "Enable 2FA"}
                </S.Button>
              </S.ButtonGroup>
            </S.ModalBody>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Page>
  );
};

export default Settings;
