import styled from "@emotion/styled";

export const Page = styled.section`
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 16px 130px;
`;

export const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 12px 0 16px;
  flex-wrap: wrap;
`;

export const AreaControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const AreaSelect = styled.select`
  border: 2px solid #1f2937;
  border-radius: 10px;
  background: #fefce8;
  color: #111827;
  padding: 9px 12px;
  font-size: 14px;
  font-weight: 700;
  min-width: 190px;
`;

export const MapShell = styled.div`
  position: relative;
  width: 100%;
  max-width: 860px;
  height: 460px;
  margin: 0 auto;
  border: 4px solid #1f2937;
  box-shadow: 0 10px 0 #0f172a;
  border-radius: 8px;
  overflow: hidden;
  background:
    radial-gradient(circle at 20% 20%, #8ddf7b 0, #66bb6a 40%, #4c9f55 100%),
    linear-gradient(135deg, #6fbf73 0%, #4e9a55 100%);

  @media (max-width: 768px) {
    height: 380px;
  }
`;

export const GridOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(16, 64, 16, 0.12) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(16, 64, 16, 0.12) 1px, transparent 1px);
  background-size: 32px 32px;
  pointer-events: none;
`;

export const CenterHint = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.72);
  border-radius: 8px;
`;

export const SpawnButton = styled.button<{ x: number; y: number; disabled?: boolean }>`
  position: absolute;
  left: ${(p) => p.x}px;
  top: ${(p) => p.y}px;
  width: 58px;
  height: 58px;
  border: 2px solid #111827;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  opacity: ${(p) => (p.disabled ? 0.55 : 1)};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  image-rendering: pixelated;
  transition: transform 0.15s ease;
  animation: idle-bob 1.2s infinite;

  &:hover {
    transform: ${(p) => (p.disabled ? "none" : "translateY(-2px)")};
  }

  img {
    width: 48px;
    height: 48px;
    image-rendering: pixelated;
  }

  @keyframes idle-bob {
    0% { transform: translateY(0); }
    50% { transform: translateY(-3px); }
    100% { transform: translateY(0); }
  }
`;

export const SpawnBadge = styled.span`
  position: absolute;
  right: -8px;
  top: -8px;
  background: #fef08a;
  border: 1px solid #854d0e;
  color: #713f12;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
`;

export const Tip = styled.p`
  margin-top: 16px;
  text-align: center;
  color: #374151;
`;

export const ModalCard = styled.div`
  width: min(520px, 92vw);
  background: #ffffff;
  border-radius: 12px;
  border: 3px solid #111827;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.28);
  padding: 16px;
`;

export const ModalRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 12px 0;

  img {
    width: 64px;
    height: 64px;
    image-rendering: pixelated;
  }
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

export const Select = styled.select`
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
`;

export const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 14px;
  flex-wrap: wrap;
`;

export const RewardCard = styled.div`
  margin-top: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px;
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: 10px;
  align-items: center;

  img {
    width: 56px;
    height: 80px;
    object-fit: cover;
    border-radius: 6px;
    border: 1px solid #94a3b8;
  }
`;
