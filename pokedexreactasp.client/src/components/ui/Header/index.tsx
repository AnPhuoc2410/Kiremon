import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./index.style";
import { useAuth } from "../../../contexts/AuthContext";

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

interface NavItemWithDropdownProps {
  title: string;
  children: React.ReactNode;
}

const NavItemWithDropdown: React.FC<NavItemWithDropdownProps> = ({
  title,
  children,
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
    <S.NavItem ref={dropdownRef}>
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
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
                  <span>Back</span>
                </S.BackButton>
              </Link>
            )}
            <S.HeaderTitle>{title}</S.HeaderTitle>
            {subtitle && <S.HeaderSubtitle>{subtitle}</S.HeaderSubtitle>}
          </S.TitleContainer>
        </S.HeaderTitleGroup>

        <S.HeaderActions>
          <form onSubmit={handleSearch}>
            <S.SearchContainer>
              <SearchIcon />
              <input
                type="text"
                placeholder="Search Pokémon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </S.SearchContainer>
          </form>

          {!isAuthenticated ? (
            <S.LoginButton onClick={() => navigate("/login")}>
              Login
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
                  <S.DropdownItem>Profile</S.DropdownItem>
                </Link>
                <Link to="/friends">
                  <S.DropdownItem as="span">Friends</S.DropdownItem>
                </Link>
                <Link to="/settings">
                  <S.DropdownItem>Settings</S.DropdownItem>
                </Link>
                <S.DropdownItem
                  as="button"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    authLogout();
                  }}
                >
                  Logout
                </S.DropdownItem>
              </S.UserDropdown>
            </S.UserMenuContainer>
          )}

          {actions && actions}
        </S.HeaderActions>
      </S.HeaderMain>

      <S.NavContainer>
        <S.NavList>
          <S.NavItem>
            <Link to="/pokemons">
              <S.NavLink as="span">Pokédex</S.NavLink>
            </Link>
          </S.NavItem>

          <S.NavItem>
            <Link to="/my-pokemon">
              <S.NavLink as="span">My Pokémon</S.NavLink>
            </Link>
          </S.NavItem>

          <NavItemWithDropdown title="Mini Games">
            <Link to="/games/combat-team">
              <S.DropdownItem>Combat Team</S.DropdownItem>
            </Link>
            <Link to="/games/whos-that-pokemon">
              <S.DropdownItem>Who's That Pokémon?</S.DropdownItem>
            </Link>
            <Link to="/games/type-matchup">
              <S.DropdownItem>Type Matchup Quiz</S.DropdownItem>
            </Link>
            <Link to="/games/catch-challenge">
              <S.DropdownItem>Catch Challenge</S.DropdownItem>
            </Link>
          </NavItemWithDropdown>

          <NavItemWithDropdown title="Explore">
            <Link to="/explore/regions">
              <S.DropdownItem>Regions</S.DropdownItem>
            </Link>
            <Link to="/explore/types">
              <S.DropdownItem>Types</S.DropdownItem>
            </Link>
            <Link to="/explore/generations">
              <S.DropdownItem>Generations</S.DropdownItem>
            </Link>
          </NavItemWithDropdown>

          <S.NavItem>
            <Link to="/poke-mart">
              <S.NavLink as="span">Poké Mart</S.NavLink>
            </Link>
          </S.NavItem>
        </S.NavList>
      </S.NavContainer>
    </S.HeaderContainer>
  );
};

export default Header;
