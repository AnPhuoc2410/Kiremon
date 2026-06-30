import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { PokeballType } from "@/types/pokemon.enums";
import { WildCardReward, WildPokemonSpawn } from "@/types/wild-area.types";

// ─── Keyframes ────────────────────────────────────────────────────────────────

const pokeballShake = keyframes`
  0%   { transform: translate(0, 0) rotate(0deg); }
  20%  { transform: translate(-10px, 0) rotate(-20deg); }
  30%  { transform: translate(10px, 0) rotate(20deg); }
  50%  { transform: translate(-10px, 0) rotate(-10deg); }
  60%  { transform: translate(10px, 0) rotate(10deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const floatBob = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const dotPulse = keyframes`
  0%, 100% { opacity: 0.25; }
  50%       { opacity: 1; }
`;

const cardReveal = keyframes`
  from { opacity: 0; transform: translateY(8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`;

// ─── Shared Overlay ───────────────────────────────────────────────────────────

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
`;

// ─── Shared Card shell (pixel border style from DESIGN.md) ───────────────────

const PixelCard = styled.div`
  position: relative;
  background: #fff;
  border: 3px solid #1f2937;
  box-shadow: 5px 5px 0 #1f2937;
  border-radius: 0;
  width: min(500px, 94vw);
  animation: ${fadeInUp} 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

// ─── Typography ───────────────────────────────────────────────────────────────

const PixelTitle = styled.h2`
  font-family: "VT323", monospace;
  font-size: 28px;
  color: #111827;
  margin: 0;
  letter-spacing: 0.5px;
  line-height: 1.1;
`;

const PixelLabel = styled.p`
  font-family: "VT323", monospace;
  font-size: 18px;
  color: #6b7280;
  margin: 0;
  letter-spacing: 0.3px;
`;

const PixelText = styled.p`
  font-family: "VT323", monospace;
  font-size: 20px;
  color: #374151;
  margin: 0;
  letter-spacing: 0.3px;
`;

// ─── Rarity tag ──────────────────────────────────────────────────────────────

const RARITY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  Legendary: { bg: "#fef9c3", text: "#854d0e", border: "#fbbf24" },
  Epic: { bg: "#f3e8ff", text: "#6b21a8", border: "#c084fc" },
  Rare: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
  Uncommon: { bg: "#dcfce7", text: "#166534", border: "#86efac" },
  Common: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db" },
};

const RarityTag = styled.span<{ $rarity: string }>`
  display: inline-block;
  font-family: "VT323", monospace;
  font-size: 14px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 3px 10px;
  border: 2px solid
    ${({ $rarity }) => RARITY_COLORS[$rarity]?.border ?? "#d1d5db"};
  background: ${({ $rarity }) => RARITY_COLORS[$rarity]?.bg ?? "#f3f4f6"};
  color: ${({ $rarity }) => RARITY_COLORS[$rarity]?.text ?? "#374151"};
`;

// ─── ENCOUNTER MODAL ─────────────────────────────────────────────────────────

const EncounterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 12px;
  border-bottom: 3px solid #1f2937;
`;

const EncounterPokemonArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px 16px;
  border-bottom: 2px solid #e5e7eb;
  background: #fafafa;
`;

const PokemonImg = styled.img`
  image-rendering: pixelated;
  width: 120px;
  height: 120px;
  object-fit: contain;
  animation: ${floatBob} 2.8s ease-in-out infinite;
`;

const PokemonMeta = styled.div`
  margin-top: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const EncounterBody = styled.div`
  padding: 16px 20px 20px;
`;

const BallSectionLabel = styled.div`
  font-family: "VT323", monospace;
  font-size: 15px;
  color: #9ca3af;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 10px;
`;

const BallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 20px;
`;

const BallOption = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  border: ${({ $selected }) =>
    $selected ? "3px solid #1f2937" : "2px solid #e5e7eb"};
  background: ${({ $selected }) => ($selected ? "#fefce8" : "#fff")};
  box-shadow: ${({ $selected }) => ($selected ? "3px 3px 0 #1f2937" : "none")};
  cursor: pointer;
  transition: all 0.1s ease;

  &:hover:not(:disabled) {
    border-color: #6b7280;
    background: #f9fafb;
  }

  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  img {
    width: 40px;
    height: 40px;
    image-rendering: pixelated;
  }

  span {
    font-family: "VT323", monospace;
    font-size: 14px;
    color: ${({ $selected }) => ($selected ? "#111827" : "#6b7280")};
    letter-spacing: 0.5px;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const RunBtn = styled.button`
  flex: 1;
  padding: 12px;
  border: 3px solid #1f2937;
  background: #fff;
  color: #1f2937;
  font-family: "VT323", monospace;
  font-size: 20px;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #1f2937;
  transition: all 0.1s;

  &:hover:not(:disabled) {
    background: #f3f4f6;
  }
  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ThrowBtn = styled.button`
  flex: 2;
  padding: 12px;
  border: 3px solid #1f2937;
  background: #1f2937;
  color: #fef08a;
  font-family: "VT323", monospace;
  font-size: 22px;
  letter-spacing: 1.5px;
  cursor: pointer;
  box-shadow: 3px 3px 0 #111827;
  transition: all 0.1s;
  text-transform: uppercase;

  &:hover:not(:disabled) {
    background: #374151;
  }
  &:active:not(:disabled) {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ─── Pokeball config ──────────────────────────────────────────────────────────

interface PokeballConfig {
  type: PokeballType;
  label: string;
  img: string;
}

const POKEBALL_OPTIONS: PokeballConfig[] = [
  {
    type: PokeballType.Pokeball,
    label: "Poké Ball",
    img: "/static/pokeball.png",
  },
  {
    type: PokeballType.GreatBall,
    label: "Great Ball",
    img: "/static/greatball.png",
  },
  {
    type: PokeballType.UltraBall,
    label: "Ultra Ball",
    img: "/static/ultraball.png",
  },
];

// ─── Encounter Modal ──────────────────────────────────────────────────────────

interface EncounterModalProps {
  spawn: WildPokemonSpawn | null;
  pokeballType: PokeballType;
  isCatching: boolean;
  onPokeballChange: (type: PokeballType) => void;
  onCancel: () => void;
  onThrow: () => void;
  spriteSrc: string;
}

export const EncounterModal = ({
  spawn,
  pokeballType,
  isCatching,
  onPokeballChange,
  onCancel,
  onThrow,
  spriteSrc,
}: EncounterModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!spawn || !cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".enc-pokemon-img", {
        duration: 0.5,
        delay: 0.1,
        y: 16,
        autoAlpha: 0,
        ease: "back.out(1.4)",
      });
      gsap.from(".enc-body > *", {
        duration: 0.35,
        delay: 0.2,
        y: 10,
        autoAlpha: 0,
        stagger: 0.06,
        ease: "power2.out",
      });
    }, cardRef);
    return () => ctx.revert();
  }, [spawn]);

  if (!spawn) return null;

  return (
    <Overlay>
      <PixelCard ref={cardRef}>
        {/* Header */}
        <EncounterHeader>
          <PixelTitle>Wild Encounter</PixelTitle>
          <RarityTag $rarity={spawn.spawnRarity}>{spawn.spawnRarity}</RarityTag>
        </EncounterHeader>

        {/* Pokemon Display */}
        <EncounterPokemonArea>
          <PokemonImg
            className="enc-pokemon-img"
            src={spriteSrc}
            alt={spawn.pokemonName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/substitute.png";
            }}
          />
          <PokemonMeta>
            <PixelTitle style={{ fontSize: 26 }}>
              {spawn.pokemonName}
            </PixelTitle>
            <PixelLabel>
              {spawn.attemptsLeft} attempt{spawn.attemptsLeft !== 1 ? "s" : ""}{" "}
              remaining
            </PixelLabel>
          </PokemonMeta>
        </EncounterPokemonArea>

        {/* Ball selection + Actions */}
        <EncounterBody className="enc-body">
          <BallSectionLabel>Select Ball</BallSectionLabel>
          <BallGrid>
            {POKEBALL_OPTIONS.map((pb) => (
              <BallOption
                key={pb.type}
                $selected={pokeballType === pb.type}
                onClick={() => onPokeballChange(pb.type)}
                disabled={isCatching}
              >
                <img
                  src={pb.img}
                  alt={pb.label}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/static/pokeball.png";
                  }}
                />
                <span>{pb.label}</span>
              </BallOption>
            ))}
          </BallGrid>
          <ButtonRow>
            <RunBtn onClick={onCancel} disabled={isCatching}>
              Run
            </RunBtn>
            <ThrowBtn onClick={onThrow} disabled={isCatching}>
              {isCatching ? "Throwing..." : "Throw!"}
            </ThrowBtn>
          </ButtonRow>
        </EncounterBody>
      </PixelCard>
    </Overlay>
  );
};

// ─── CATCHING MODAL ───────────────────────────────────────────────────────────

const CatchingCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: min(400px, 94vw);
  padding: 36px 40px;
  background: #fff;
  border: 3px solid #1f2937;
  box-shadow: 5px 5px 0 #1f2937;
  animation: ${fadeInUp} 0.2s ease both;
`;

const CatchingPokemonImg = styled.img`
  image-rendering: pixelated;
  width: 112px;
  height: 112px;
  object-fit: contain;
  opacity: 0.85;
`;

const PokeballImg = styled.img<{ $isShaking: boolean; $key: number }>`
  width: 88px;
  height: 88px;
  image-rendering: pixelated;
  animation: ${({ $isShaking }) => ($isShaking ? pokeballShake : "none")} 1.25s
    cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
`;

const ShakeDots = styled.div`
  display: flex;
  gap: 10px;
`;

const ShakeDot = styled.div<{ $lit: boolean; $index: number }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #1f2937;
  background: ${({ $lit }) => ($lit ? "#1f2937" : "transparent")};
  transition: background 0.3s ease;
`;

const CatchStatusText = styled.div`
  font-family: "VT323", monospace;
  font-size: 22px;
  color: #374151;
  letter-spacing: 1.5px;
  text-align: center;
`;

interface CatchingModalProps {
  open: boolean;
  spriteSrc: string;
  shakeCount: number;
  pokemonName: string;
  pokeballType: PokeballType;
}

export const CatchingModal = ({
  open,
  spriteSrc,
  shakeCount,
  pokemonName,
  pokeballType,
}: CatchingModalProps) => {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (shakeCount > 0) setAnimKey((k) => k + 1);
  }, [shakeCount]);

  if (!open) return null;

  const statusText =
    shakeCount === 0
      ? "Throwing..."
      : shakeCount === 1
        ? "Shake 1..."
        : shakeCount === 2
          ? "Shake 2..."
          : "Shake 3!";

  return (
    <Overlay>
      <CatchingCard>
        <CatchingPokemonImg
          src={spriteSrc}
          alt={pokemonName}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/substitute.png";
          }}
        />
        <PokeballImg
          key={animKey}
          src={
            POKEBALL_OPTIONS.find((p) => p.type === pokeballType)?.img ||
            "/static/pokeball.png"
          }
          alt="pokeball"
          $isShaking={shakeCount > 0}
          $key={animKey}
        />
        <ShakeDots>
          {[1, 2, 3].map((i) => (
            <ShakeDot key={i} $lit={shakeCount >= i} $index={i} />
          ))}
        </ShakeDots>
        <CatchStatusText>{statusText}</CatchStatusText>
      </CatchingCard>
    </Overlay>
  );
};

// ─── RESULT MODAL ─────────────────────────────────────────────────────────────

const ResultCard = styled.div`
  width: min(480px, 94vw);
  background: #fff;
  border: 3px solid #1f2937;
  box-shadow: 5px 5px 0 #1f2937;
`;

const ResultHeader = styled.div<{ $success: boolean }>`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-bottom: 3px solid #1f2937;
  background: ${({ $success }) => ($success ? "#f0fdf4" : "#fff7f7")};
`;

const ResultStatusIcon = styled.div<{ $success: boolean }>`
  width: 36px;
  height: 36px;
  border: 3px solid #1f2937;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: "VT323", monospace;
  font-size: 22px;
  color: ${({ $success }) => ($success ? "#166534" : "#991b1b")};
  background: ${({ $success }) => ($success ? "#dcfce7" : "#fee2e2")};
`;

const ResultBody = styled.div`
  padding: 16px 20px 20px;
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
`;

const StatCell = styled.div`
  border: 2px solid #e5e7eb;
  padding: 10px 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatCellLabel = styled.span`
  font-family: "VT323", monospace;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #9ca3af;
`;

const StatCellValue = styled.span`
  font-family: "VT323", monospace;
  font-size: 24px;
  color: #111827;
`;

// Card reward section
const Divider = styled.div`
  height: 2px;
  background: #e5e7eb;
  margin: 16px 0;
`;

const CardRewardSection = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  animation: ${cardReveal} 0.4s 0.15s cubic-bezier(0.16, 1, 0.3, 1) both;
`;

const TcgCardImg = styled.img`
  width: 90px;
  height: auto;
  border: 2px solid #1f2937;
  box-shadow: 3px 3px 0 #1f2937;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.04) rotate(-1deg);
  }
`;

const CardInfoBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardSectionLabel = styled.div`
  font-family: "VT323", monospace;
  font-size: 13px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #9ca3af;
  margin-bottom: 4px;
`;

const CardName = styled.div`
  font-family: "VT323", monospace;
  font-size: 24px;
  color: #111827;
  line-height: 1.1;
`;

const CardRarityTag = styled.span`
  display: inline-block;
  font-family: "VT323", monospace;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 2px 8px;
  border: 2px solid #1f2937;
  color: #1f2937;
  background: #fefce8;
`;

const CloseBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 13px;
  border: 3px solid #1f2937;
  background: #1f2937;
  color: #fef08a;
  font-family: "VT323", monospace;
  font-size: 22px;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 3px 3px 0 #111827;
  transition: all 0.1s;

  &:hover {
    background: #374151;
  }
  &:active {
    transform: translate(2px, 2px);
    box-shadow: none;
  }
`;

// ─── WildArea Catch Result type ───────────────────────────────────────────────

interface CatchResultData {
  pokemonCaught: boolean;
  shakeCount: number;
  message: string;
  attemptsLeft: number;
  spawnConsumed: boolean;
  cardReward?: WildCardReward | null;
}

interface ResultModalProps {
  open: boolean;
  result: CatchResultData | null;
  onClose: () => void;
}

export const ResultModal = ({ open, result, onClose }: ResultModalProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !result || !cardRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      // 1. Card slides in
      tl.from(cardRef.current, {
        y: 24,
        autoAlpha: 0,
        duration: 0.35,
        ease: "back.out(1.4)",
      });

      // 2. Header elements
      tl.from(
        ".gsap-result-header > *",
        {
          y: 8,
          autoAlpha: 0,
          duration: 0.25,
          stagger: 0.06,
        },
        "-=0.1",
      );

      // 3. Stat cells stagger
      tl.from(
        ".gsap-stat-cell",
        {
          y: 10,
          autoAlpha: 0,
          duration: 0.28,
          stagger: 0.07,
        },
        "-=0.05",
      );

      // 4. Card reward — image flip + info slide
      if (result.cardReward) {
        tl.fromTo(
          ".gsap-tcg-img",
          { rotateY: -80, autoAlpha: 0, scale: 0.85 },
          {
            rotateY: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.2)",
          },
          "-=0.05",
        );
        tl.from(
          ".gsap-card-info > *",
          {
            x: 10,
            autoAlpha: 0,
            duration: 0.25,
            stagger: 0.07,
          },
          "-=0.35",
        );
      }

      // 5. Close button
      tl.from(
        ".gsap-close-btn",
        {
          y: 6,
          autoAlpha: 0,
          duration: 0.2,
        },
        "-=0.1",
      );
    }, cardRef);

    return () => ctx.revert();
  }, [open, result]);

  if (!open || !result) return null;

  const success = result.pokemonCaught;

  return (
    <Overlay
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <ResultCard ref={cardRef}>
        {/* Header */}
        <ResultHeader $success={success} className="gsap-result-header">
          <ResultStatusIcon $success={success}>
            {success ? "✓" : "✗"}
          </ResultStatusIcon>
          <div>
            <PixelTitle style={{ fontSize: 24 }}>
              {success ? "Gotcha!" : "Broke free!"}
            </PixelTitle>
            <PixelLabel style={{ fontSize: 16, marginTop: 2 }}>
              {result.message}
            </PixelLabel>
          </div>
        </ResultHeader>

        {/* Body */}
        <ResultBody>
          <StatsRow>
            <StatCell className="gsap-stat-cell">
              <StatCellLabel>Shakes</StatCellLabel>
              <StatCellValue>{result.shakeCount}</StatCellValue>
            </StatCell>
            <StatCell className="gsap-stat-cell">
              <StatCellLabel>Attempts</StatCellLabel>
              <StatCellValue>{result.attemptsLeft}</StatCellValue>
            </StatCell>
            <StatCell className="gsap-stat-cell">
              <StatCellLabel>Consumed</StatCellLabel>
              <StatCellValue>
                {result.spawnConsumed ? "Yes" : "No"}
              </StatCellValue>
            </StatCell>
          </StatsRow>

          {/* Card Reward */}
          {result.cardReward && (
            <>
              <Divider />
              <CardSectionLabel>Card Reward</CardSectionLabel>
              <CardRewardSection>
                <TcgCardImg
                  className="gsap-tcg-img"
                  src={
                    result.cardReward.imageLarge ||
                    result.cardReward.imageSmall ||
                    "/substitute.png"
                  }
                  alt={result.cardReward.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/substitute.png";
                  }}
                />
                <CardInfoBlock className="gsap-card-info">
                  <CardName>{result.cardReward.name}</CardName>
                  <CardRarityTag>{result.cardReward.rarityTier}</CardRarityTag>
                  {result.cardReward.rarity && (
                    <PixelText style={{ fontSize: 16, marginTop: 4 }}>
                      {result.cardReward.rarity}
                    </PixelText>
                  )}
                  <PixelLabel style={{ fontSize: 15, marginTop: 6 }}>
                    Added to your collection
                  </PixelLabel>
                </CardInfoBlock>
              </CardRewardSection>
            </>
          )}

          <CloseBtn className="gsap-close-btn" onClick={onClose}>
            {success ? "Awesome!" : "Continue"}
          </CloseBtn>
        </ResultBody>
      </ResultCard>
    </Overlay>
  );
};
