import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./index.style";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts";
import { t } from "@/utils/uiI18n";

interface HeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

// Icons
const BackIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 4L5 8L9 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 14L11 11"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6L8 10L12 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GlobeIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M2 12H22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 2C14.5 4.5 16 8 16 12C16 16 14.5 19.5 12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 2C9.5 4.5 8 8 8 12C8 16 9.5 19.5 12 22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GuideBookIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ imageRendering: "pixelated" }}
  >
    {/* Outer black outline */}
    <rect x="1" y="1" width="12" height="14" fill="#212529" />
    {/* Page edge outline */}
    <rect x="13" y="2" width="2" height="12" fill="#212529" />

    {/* Red book cover */}
    <rect x="2" y="2" width="10" height="12" fill="#e3350d" />
    {/* Gold/yellow decoration strip on spine */}
    <rect x="2" y="2" width="2" height="12" fill="#b02508" />

    {/* Page edges (white) */}
    <rect x="13" y="3" width="1" height="10" fill="#f8f9fa" />

    {/* Pokédex large blue sensor (lens) */}
    <rect x="5" y="4" width="4" height="4" fill="#212529" />
    <rect x="6" y="5" width="2" height="2" fill="#5bc0de" />
    <rect x="6" y="5" width="1" height="1" fill="#ffffff" />

    {/* Pokédex small lights */}
    <rect x="10" y="4" width="1" height="1" fill="#ffcc00" />
    <rect x="10" y="6" width="1" height="1" fill="#2ad33a" />
  </svg>
);

interface NavItemWithDropdownProps {
  title: string;
  children: React.ReactNode;
  id?: string;
}

const NavItemWithDropdown: React.FC<NavItemWithDropdownProps> = ({
  title,
  children,
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <S.NavItem ref={dropdownRef} id={id}>
      <S.NavLink
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? "active" : ""}
      >
        {title}
        <ChevronDownIcon />
      </S.NavLink>
      <S.Dropdown isOpen={isOpen}>{children}</S.Dropdown>
    </S.NavItem>
  );
};

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  backTo,
  actions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, user, authLogout } = useAuth();
  const { currentLanguage, setLanguage, availableLanguages, languageId } =
    useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleStartTour = () => {
    window.dispatchEvent(new Event("start-tour-guide"));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(event.target as Node)
      ) {
        setIsLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Build display name: firstName + lastName, fallback to username
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user?.username ?? "Trainer");

  const avatarUrl =
    user?.avatarUrl ??
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png";

  return (
    <S.HeaderContainer>
      <S.HeaderMain>
        <S.HeaderTitleGroup>
          <S.LogoContainer>
            <Link to="/">
              <img src="/pokeball-logo.png" alt="Pokédex Logo" />
            </Link>
          </S.LogoContainer>

          <S.TitleContainer>
            {backTo && (
              <Link to={backTo} className="back-button">
                <S.BackButton>
                  <BackIcon />
                  <span>{t("common.back", languageId)}</span>
                </S.BackButton>
              </Link>
            )}
            <S.HeaderTitle>{title}</S.HeaderTitle>
            {subtitle && <S.HeaderSubtitle>{subtitle}</S.HeaderSubtitle>}
          </S.TitleContainer>
        </S.HeaderTitleGroup>

        <S.HeaderActions>
          <form onSubmit={handleSearch}>
            <S.SearchContainer id="tour-search-container">
              <SearchIcon />
              <input
                type="text"
                placeholder={t("search.placeholder", languageId)}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </S.SearchContainer>
          </form>

          <S.LanguageMenuContainer ref={langMenuRef}>
            <S.LanguageButton
              isOpen={isLangMenuOpen}
              onClick={() => setIsLangMenuOpen((prev) => !prev)}
            >
              <GlobeIcon />
              <span>{currentLanguage.code.toUpperCase()}</span>
              <ChevronDownIcon />
            </S.LanguageButton>
            <S.LanguageDropdown isOpen={isLangMenuOpen}>
              {availableLanguages.map((lang) => (
                <S.LanguageOption
                  key={lang.id}
                  isActive={lang.id === currentLanguage.id}
                  onClick={() => {
                    setLanguage(lang.id);
                    setIsLangMenuOpen(false);
                  }}
                >
                  <span className="code">{lang.code.toUpperCase()}</span>
                  <span className="name">{lang.nativeName}</span>
                </S.LanguageOption>
              ))}
            </S.LanguageDropdown>
          </S.LanguageMenuContainer>

          <S.GuideButton onClick={handleStartTour} title="Help Tour" id="tour-nav-guide">
            <GuideBookIcon />
            <span>{t("common.guide", languageId)}</span>
          </S.GuideButton>

          {!isAuthenticated ? (
            <S.LoginButton onClick={() => navigate("/login")}>
              {t("user.login", languageId)}
            </S.LoginButton>
          ) : (
            <S.UserMenuContainer ref={userMenuRef}>
              <S.UserButton
                isOpen={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <S.UserAvatar>
                  <img src={avatarUrl} alt="User Avatar" />
                </S.UserAvatar>
                <span>{displayName}</span>
                <ChevronDownIcon />
              </S.UserButton>
              <S.UserDropdown isOpen={isUserMenuOpen}>
                <Link to="/profile">
                  <S.DropdownItem>
                    {t("user.profile", languageId)}
                  </S.DropdownItem>
                </Link>
                <Link to="/friends">
                  <S.DropdownItem as="span">
                    {t("user.friends", languageId)}
                  </S.DropdownItem>
                </Link>
                <Link to="/settings">
                  <S.DropdownItem>
                    {t("user.settings", languageId)}
                  </S.DropdownItem>
                </Link>
                <S.DropdownItem
                  as="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    authLogout();
                  }}
                >
                  {t("user.logout", languageId)}
                </S.DropdownItem>
              </S.UserDropdown>
            </S.UserMenuContainer>
          )}

          {actions && actions}
        </S.HeaderActions>
      </S.HeaderMain>

      <S.NavContainer>
        <S.NavList>
          <S.NavItem id="tour-nav-pokedex">
            <Link to="/pokemons">
              <S.NavLink as="span">{t("nav.pokedex", languageId)}</S.NavLink>
            </Link>
          </S.NavItem>

          <S.NavItem id="tour-nav-mypokemon">
            <Link to="/my-pokemon">
              <S.NavLink as="span">{t("nav.myPokemon", languageId)}</S.NavLink>
            </Link>
          </S.NavItem>

          <NavItemWithDropdown title={t("nav.miniGames", languageId)} id="tour-nav-games">
            <Link to="/games/combat-team">
              <S.DropdownItem>
                {t("games.combatTeam", languageId)}
              </S.DropdownItem>
            </Link>
            <Link to="/games/whos-that-pokemon">
              <S.DropdownItem>
                {t("games.whosThatPokemon", languageId)}
              </S.DropdownItem>
            </Link>
            <Link to="/games/type-matchup">
              <S.DropdownItem>
                {t("games.typeMatchup", languageId)}
              </S.DropdownItem>
            </Link>
            <Link to="/games/catch-challenge">
              <S.DropdownItem>
                {t("games.catchChallenge", languageId)}
              </S.DropdownItem>
            </Link>
          </NavItemWithDropdown>

          <NavItemWithDropdown
            title={t("nav.explore", languageId)}
            id="tour-nav-explore"
          >
            <Link to="/explore/regions">
              <S.DropdownItem>
                {t("explore.regions", languageId)}
              </S.DropdownItem>
            </Link>
            <Link to="/explore/types">
              <S.DropdownItem>{t("explore.types", languageId)}</S.DropdownItem>
            </Link>
            <Link to="/explore/generations">
              <S.DropdownItem>
                {t("explore.generations", languageId)}
              </S.DropdownItem>
            </Link>
          </NavItemWithDropdown>

          <S.NavItem id="tour-nav-market">
            <Link to="/poke-mart">
              <S.NavLink as="span">{t("nav.pokeMart", languageId)}</S.NavLink>
            </Link>
          </S.NavItem>

          <S.NavItem id="tour-nav-tcg">
            <Link to="/poke-tcg">
              <S.NavLink as="span">{t("nav.pokeTcg", languageId)}</S.NavLink>
            </Link>
          </S.NavItem>
        </S.NavList>
      </S.NavContainer>
    </S.HeaderContainer>
  );
};

export default Header;
