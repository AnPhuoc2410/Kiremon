import styled from "@emotion/styled";
import { colors } from "../../utils";

export const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const HeaderMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const HeaderTitleGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const LogoContainer = styled.div`
  margin-right: 16px;
  display: flex;
  align-items: center;

  img {
    height: 36px;
    width: auto;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: ${colors["gray-700"]};
  transition: color 0.2s ease;
  font-weight: 500;

  &:hover {
    color: ${colors["gray-900"]};
  }

  svg {
    margin-right: 4px;
  }
`;

export const HeaderTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors["gray-900"]};
  margin: 0;
`;

export const HeaderSubtitle = styled.div`
  color: ${colors["gray-600"]};
  margin-top: 4px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 300px;

  @media (max-width: 768px) {
    width: 200px;
  }

  input {
    width: 100%;
    padding: 8px 12px 8px 36px;
    border-radius: 8px;
    border: 1px solid ${colors["gray-300"]};
    outline: none;
    font-size: 14px;

    &:focus {
      border-color: ${colors["blue-500"]};
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }
  }

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: ${colors["gray-500"]};
  }
`;

export const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid transparent;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LoginButton = styled.button`
  background-color: ${colors["blue-600"]};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${colors["blue-700"]};
  }
`;

export const UserMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const UserButton = styled.button<{ isOpen?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid ${colors["gray-200"]};
  padding: 6px 10px;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    border-color: ${colors["blue-400"]};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  }

  span {
    font-size: 14px;
    font-weight: 600;
    color: ${colors["gray-800"]};
  }

  svg {
    width: 16px;
    height: 16px;
    color: ${colors["gray-600"]};
    transition: transform 0.25s ease;
    transform: ${(props) => (props.isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

export const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid ${colors["gray-200"]};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 140px;
  padding: 6px 0;
  z-index: 200;
  overflow: hidden;

  /* Animation */
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform: ${(props) =>
    props.isOpen ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)"};
  transform-origin: top right;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const NavContainer = styled.nav`
  margin-top: 16px;
  border-top: 1px solid ${colors["gray-200"]};
  padding-top: 8px;
`;

export const NavList = styled.ul`
  display: flex;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavItem = styled.li`
  position: relative;
`;

export const NavLink = styled.button`
  background: none;
  border: none;
  font-size: 15px;
  font-weight: 500;
  color: ${colors["gray-700"]};
  cursor: pointer;
  padding: 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: ${colors["blue-600"]};
  }

  svg {
    width: 16px;
    height: 16px;
    transition: transform 0.2s;
  }

  &.active {
    color: ${colors["blue-600"]};

    svg {
      transform: rotate(180deg);
    }
  }
`;

export const Dropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  background-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 8px 0;
  min-width: 200px;
  z-index: 100;
  overflow: hidden;

  /* Animation */
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  transform: ${(props) =>
    props.isOpen ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.95)"};
  transform-origin: top left;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const DropdownItem = styled.div`
  display: block;
  padding: 10px 16px;
  color: ${colors["gray-700"]};
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${colors["gray-100"]};
    color: ${colors["blue-600"]};
    padding-left: 20px;
  }

  &:active {
    background-color: ${colors["gray-200"]};
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${colors["gray-700"]};

  @media (max-width: 768px) {
    display: block;
  }
`;
