import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  IconDashboard,
  IconMap,
  IconArrowLeft,
  IconCards,
} from "@tabler/icons-react";
import * as S from "./index.style";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <S.LayoutContainer>
      <S.Sidebar>
        <S.SidebarHeader>
          <img src="/pokeball-logo.png" alt="Logo" width={32} />
          <span>Kiremon Admin</span>
        </S.SidebarHeader>

        <S.UserInfo>
          <div>Logged in as:</div>
          <div className="username">{user?.username || "Admin"}</div>
        </S.UserInfo>

        <S.NavList>
          <S.NavItem>
            <NavLink to="/admin" end>
              {({ isActive }) => (
                <S.NavLinkContent $active={isActive}>
                  <IconDashboard size={20} />
                  <span>Dashboard</span>
                </S.NavLinkContent>
              )}
            </NavLink>
          </S.NavItem>
          <S.NavItem>
            <NavLink to="/admin/wild-area">
              {({ isActive }) => (
                <S.NavLinkContent $active={isActive}>
                  <IconMap size={20} />
                  <span>Wild Area Config</span>
                </S.NavLinkContent>
              )}
            </NavLink>
          </S.NavItem>
          <S.NavItem>
            <NavLink to="/admin/card-reward">
              {({ isActive }) => (
                <S.NavLinkContent $active={isActive}>
                  <IconCards size={20} />
                  <span>Card Reward Config</span>
                </S.NavLinkContent>
              )}
            </NavLink>
          </S.NavItem>
        </S.NavList>

        <div style={{ flex: 1 }} />

        <S.ReturnButton onClick={() => navigate("/pokemons")}>
          <IconArrowLeft size={20} />
          Return to Game
        </S.ReturnButton>
      </S.Sidebar>

      <S.MainContent>
        <Outlet />
      </S.MainContent>
    </S.LayoutContainer>
  );
}
