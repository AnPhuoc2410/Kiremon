import styled from '@emotion/styled';
import { colors, units } from '../../components/utils';

export const Container = styled.div`
  padding: ${units.spacing.xl};
  min-height: 100vh;
  background: linear-gradient(160deg, ${colors['sky-100']} 0%, #fff 60%);
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: ${units.spacing.lg};
`;

export const Tile = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${units.spacing.sm};
  padding: ${units.spacing.lg};
  border-radius: 16px;
  border: 2px solid ${colors['blue-300']};
  background: radial-gradient(circle at 30% 20%, ${colors['yellow-200']} 0, ${colors['sky-100']} 65%, #fff 100%);
  cursor: pointer;
  overflow: hidden;
  transition: transform .2s ease, box-shadow .2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 18px rgba(0,0,0,0.08);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(135deg, transparent 0 10px, rgba(255,255,255,.07) 10px 20px);
    pointer-events: none;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  color: ${colors['gray-900']};
`;

export const Subtitle = styled.p`
  margin: 0;
  color: ${colors['gray-600']};
`;

export const Preview = styled.div`
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 120px;
  height: 120px;
  display: grid;
  place-items: center;
  filter: drop-shadow(0 6px 8px rgba(0,0,0,.15));
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0) }
    50% { transform: translateY(-6px) }
  }
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: ${units.spacing.sm};
  margin: ${units.spacing.base} 0 ${units.spacing.lg};
`;

export const Select = styled.select`
  border: 2px solid ${colors['gray-300']};
  padding: 6px 10px;
  border-radius: 8px;
  background: #fff;
`;

export const Stat = styled.span`
  background: ${colors['green-200']};
  border-radius: 999px;
  padding: 4px 10px;
  font-weight: 700;
`;
