import styled from "@emotion/styled";
import { colors, units } from "@/components/utils";

export const ArcadeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 80px);
  padding: ${units.spacing.base};
  padding-bottom: ${units.spacing["2xl"]};
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
`;

export const HeroBanner = styled.div`
  width: 100%;
  background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #0f172a 100%);
  border-radius: 20px;
  padding: 36px 28px;
  color: #ffffff;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.25);
  margin-bottom: ${units.spacing.xl};
  border: 2px solid #334155;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at 80% 20%,
      rgba(56, 189, 248, 0.15),
      transparent 40%
    );
    pointer-events: none;
  }
`;

export const HeroTitle = styled.h1`
  font-size: 32px;
  font-weight: 900;
  margin: 0 0 10px;
  background: linear-gradient(135deg, #38bdf8 0%, #a855f7 50%, #f43f5e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 600px) {
    font-size: 26px;
  }
`;

export const HeroSubtitle = styled.p`
  font-size: 15px;
  color: #94a3b8;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${units.spacing.lg};
  width: 100%;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 620px) {
    grid-template-columns: 1fr;
  }
`;

export const GameCard = styled.div<{ themeColor: string }>`
  background: #ffffff;
  border-radius: 16px;
  border: 2px solid #e2e8f0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  transition: all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${(p) => p.themeColor};
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.1);
    border-color: ${(p) => p.themeColor};
  }
`;

export const GameCardTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const GameIconCircle = styled.div<{ themeColor: string }>`
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: ${(p) => `${p.themeColor}18`};
  color: ${(p) => p.themeColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const TagBadge = styled.span`
  background: #f1f5f9;
  color: #475569;
  border-radius: 9999px;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const GameTitle = styled.h3`
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
`;

export const GameDesc = styled.p`
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0;
`;

export const CardFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
`;

export const ScoreRecord = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
  display: flex;
  align-items: center;
  gap: 6px;

  span.label {
    color: #94a3b8;
  }
`;
