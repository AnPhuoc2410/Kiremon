import styled from '@emotion/styled';
import { colors } from '../../components/utils';

export const Page = styled.div`
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
`;

export const Card = styled.div`
  width: 520px;
  max-width: 100%;
  background: linear-gradient(180deg, #ffffff, #fbfdff);
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
  border-top: 6px solid ${colors['red-500']};
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
`;

export const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.25rem;
  color: ${colors['gray-900']};
`;

export const Subtitle = styled.p`
  margin: 0 0 12px 0;
  color: ${colors['gray-600']};
  font-size: 13px;
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
`;

export const SmallText = styled.small`
  color: ${colors['gray-500']};
`;
