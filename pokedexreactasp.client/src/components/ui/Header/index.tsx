import React from 'react';
import styled from '@emotion/styled';
import { Link } from 'react-router-dom';
import { colors } from '../../utils';
import { Text } from '..';

interface HeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
}

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: column;
  padding: 16px;
  margin-bottom: 16px;

  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-title-group {
    display: flex;
    flex-direction: column;
  }

  .back-button {
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
  }

  .header-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors["gray-900"]};
    margin: 0;
  }

  .header-subtitle {
    color: ${colors["gray-600"]};
    margin-top: 4px;
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
`;

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4L5 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ title, subtitle, backTo, actions }) => {
  return (
    <HeaderContainer>
      {backTo && (
        <Link to={backTo} className="back-button">
          <BackIcon />
          <span>Back</span>
        </Link>
      )}
      <div className="header-main">
        <div className="header-title-group">
          <Text as="h1" className="header-title">{title}</Text>
          {subtitle && <Text className="header-subtitle">{subtitle}</Text>}
        </div>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
    </HeaderContainer>
  );
};

export default Header;