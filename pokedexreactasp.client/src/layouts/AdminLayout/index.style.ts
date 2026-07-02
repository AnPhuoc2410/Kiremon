import styled from "@emotion/styled";
import { colors } from "@/components/utils";

export const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: ${colors["gray-100"]};
`;

export const Sidebar = styled.aside`
  width: 260px;
  background-color: #09090b; /* Deep OLED black */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10;
  padding: 24px 16px;
  overflow-y: auto;
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  span {
    font-family: "VT323", monospace;
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
  }
`;

export const UserInfo = styled.div`
  margin-bottom: 32px;
  font-family: "Fira Code", monospace;
  font-size: 12px;
  color: ${colors["gray-400"]};

  .username {
    font-family: "VT323", monospace;
    font-size: 22px;
    color: ${colors["green-400"]};
    margin-top: 4px;
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const NavItem = styled.li`
  a {
    text-decoration: none;
  }
`;

export const NavLinkContent = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: "VT323", monospace;
  font-size: 20px;
  background-color: ${(p) => (p.$active ? "#18181b" : "transparent")};
  color: ${(p) => (p.$active ? "#ffffff" : "#a1a1aa")};
  border: 1px solid
    ${(p) => (p.$active ? "rgba(255, 255, 255, 0.1)" : "transparent")};
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #18181b;
    color: #ffffff;
  }
`;

export const ReturnButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  padding: 12px;
  background-color: #18181b;
  color: #a1a1aa;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-family: "VT323", monospace;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #27272a;
    color: #ffffff;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  position: relative;
  background-color: ${colors["gray-100"]};

  /* Add custom scrollbar for retro feel */
  &::-webkit-scrollbar {
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    background: ${colors["gray-300"]};
    border-left: 2px solid ${colors["gray-400"]};
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors["gray-500"]};
    border: 2px solid ${colors["gray-900"]};
  }
`;
