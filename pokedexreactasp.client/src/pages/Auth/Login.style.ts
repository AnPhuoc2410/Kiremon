import styled from '@emotion/styled';
import { colors } from '../../components/utils';

export const Page = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  /* Pokémon-inspired soft background with subtle Pokéball accent */
  background: linear-gradient(180deg, ${colors['red-100']} 0%, ${colors['gray-100']} 100%);
  background-image: radial-gradient(circle at 82% 18%, rgba(239,68,68,0.06) 0, transparent 18%), radial-gradient(circle at 18% 82%, rgba(59,130,246,0.03) 0, transparent 20%);
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-direction: column;
  gap: 2px;
`;

export const Text = styled.p`
  margin: 0;
  color: ${colors['gray-600']};
  font-size: 15px;
`;

export const Card = styled.div`
  width: 420px;
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.12);
  border-top: 6px solid ${colors['red-500']};
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 50px rgba(15, 23, 42, 0.14);
  }
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.35rem;
  color: ${colors['gray-900']};
  letter-spacing: 0.4px;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
  display: block;
`;
export const Subtitle = styled.p`
  margin: 0 0 16px 0;
  color: ${colors['gray-600']};
  font-size: 14px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Input = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${colors['gray-300']};
  outline: none;
  font-size: 14px;

  &:focus {
    border-color: ${colors['blue-500']};
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.06);
  }
`;

export const Submit = styled.button`
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: ${colors['blue-600']};
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: ${colors['blue-700']};
  }
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0 12px 0;
  color: ${colors['gray-400']};
  font-size: 13px;

  &::before,
  &::after {
    content: '';
    flex: 1 1 auto;
    height: 1px;
    background: ${colors['gray-200']};
    border-radius: 1px;
  }
`;

export const SocialButton = styled.button`
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid ${colors['gray-200']};
  background: white;
  color: ${colors['gray-800']};
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  cursor: pointer;
  font-weight: 600;
  transition: box-shadow 120ms ease, transform 120ms ease;

  &:hover {
    box-shadow: 0 8px 22px rgba(15, 23, 42, 0.06);
    transform: translateY(-2px);
  }
`;

export const SmallText = styled.small`
  color: ${colors['gray-500']};
  font-size: 13px;
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const Footer = styled.div`
  margin-top: 12px;
  font-size: 13px;
  color: ${colors['gray-600']};
  display: flex;
  justify-content: space-between;
`;
