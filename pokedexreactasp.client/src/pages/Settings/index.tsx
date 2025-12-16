import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/ui";
import { useAuth } from "../../contexts/AuthContext";
import * as S from "./index.style";
import {
  ShieldIcon,
  UserIcon,
  BellIcon,
  EmailIcon,
  LockIcon,
  SettingsIcon,
  ShieldCheckIcon,
} from "./icons";
import { Enable2FAModal, Disable2FAModal } from "./components";
import { use2FA } from "./hooks/use2FA";

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("security");

  // 2FA custom hook
  const twoFA = use2FA();

  // Derive 2FA status directly from user object
  const twoFactorEnabled = user?.twoFactorEnabled || false;

  // Notification states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
    await twoFA.handleSetup2FA();
    setLoading(false);
  };

  const handleEnable2FA = async () => {
    await twoFA.handleEnable2FA();
  };

  const handleDisable2FA = async () => {
    await twoFA.handleDisable2FA();
  };

  return (
    <S.Page>
      <Header title="Settings" subtitle="Manage your account preferences" />

      <S.Container>
        {/* Sidebar Navigation */}
        <S.Sidebar>
          <S.SidebarTitle>
            <SettingsIcon />
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
                  <EmailIcon />
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
                  <EmailIcon />
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
                  <LockIcon />
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
                    <ShieldCheckIcon />
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
                    onClick={twoFA.handleOpenDisableModal}
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

      {/* 2FA Modals */}
      <Enable2FAModal
        show={twoFA.show2FAModal}
        qrCodeDataUrl={twoFA.qrCodeDataUrl}
        twoFactorSetupData={twoFA.twoFactorSetupData}
        verificationCode={twoFA.verificationCode}
        setVerificationCode={twoFA.setVerificationCode}
        isSettingUp={twoFA.isSettingUp2FA}
        onEnable={handleEnable2FA}
        onClose={twoFA.handleClose2FAModal}
        onCopySecret={twoFA.handleCopySecret}
      />

      <Disable2FAModal
        show={twoFA.showDisable2FAModal}
        disableCode={twoFA.disableCode}
        setDisableCode={twoFA.setDisableCode}
        isDisabling={twoFA.isDisabling2FA}
        onDisable={handleDisable2FA}
        onClose={twoFA.handleCloseDisableModal}
      />
    </S.Page>
  );
};

export default Settings;
