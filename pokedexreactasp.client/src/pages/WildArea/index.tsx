import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

import { Button, Header, Loading, Navbar, Text } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useWildArea, useWildAreas } from "@/hooks/queries";
import { useAttemptWildCatch } from "@/hooks/mutations";
import { wildAreaService } from "@/services/wild-area/wild-area.service";
import { PokeballType } from "@/types/pokemon.enums";
import { WildCatchResult, WildPokemonSpawn } from "@/types/wild-area.types";
import { toAnimatedSprite } from "@/hooks/common/battle/battleHelpers";
import { EncounterModal, CatchingModal, ResultModal } from "./WildModals";

import * as S from "./index.style";
import { MAP_W, MAP_H, VIEWPORT_W, VIEWPORT_H } from "./index.style";

const DEFAULT_AREA_CODE = "viridian_field";
const PAN_SPEED = 6; // pixels per frame

// Spawn positions — 32 slots spread evenly across the 1600×900 map,
// shuffled so that low indexes (0-7) are scattered everywhere instead of bunched in row 1.
const spawnPositions = [
  { x: 220, y: 60 },
  { x: 1280, y: 530 },
  { x: 730, y: 80 },
  { x: 260, y: 280 },
  { x: 1070, y: 90 },
  { x: 50, y: 530 },
  { x: 1490, y: 280 },
  { x: 700, y: 770 },
  { x: 440, y: 320 },
  { x: 1240, y: 70 },
  { x: 80, y: 300 },
  { x: 940, y: 510 },
  { x: 1420, y: 60 },
  { x: 410, y: 560 },
  { x: 1150, y: 330 },
  { x: 380, y: 740 },
  { x: 800, y: 310 },
  { x: 60, y: 70 },
  { x: 1320, y: 300 },
  { x: 560, y: 65 },
  { x: 1110, y: 570 },
  { x: 620, y: 290 },
  { x: 1530, y: 100 },
  { x: 230, y: 510 },
  { x: 900, y: 60 },
  { x: 1460, y: 520 },
  { x: 390, y: 90 },
  { x: 980, y: 280 },
  { x: 120, y: 750 },
  { x: 760, y: 550 },
  { x: 1050, y: 750 },
  { x: 590, y: 520 },
];

// ─── Key state tracking ───────────────────────────────────────────────────────
type KeyMap = { up: boolean; down: boolean; left: boolean; right: boolean };
const EMPTY_KEYS: KeyMap = {
  up: false,
  down: false,
  left: false,
  right: false,
};

const keyToDir = (key: string): keyof KeyMap | null => {
  if (key === "ArrowUp" || key === "w" || key === "W") return "up";
  if (key === "ArrowDown" || key === "s" || key === "S") return "down";
  if (key === "ArrowLeft" || key === "a" || key === "A") return "left";
  if (key === "ArrowRight" || key === "d" || key === "D") return "right";
  return null;
};

// ─── Day / Night icons (inline SVG) ──────────────────────────────────────────

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
    {[
      ["12", "2", "12", "4"],
      ["12", "20", "12", "22"],
      ["4.22", "4.22", "5.64", "5.64"],
      ["18.36", "18.36", "19.78", "19.78"],
      ["2", "12", "4", "12"],
      ["20", "12", "22", "12"],
      ["4.22", "19.78", "5.64", "18.36"],
      ["18.36", "5.64", "19.78", "4.22"],
    ].map(([x1, y1, x2, y2], i) => (
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ))}
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────

const WildArea = () => {
  const navRef = createRef<HTMLDivElement>();
  const mapContentRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef<KeyMap>({ ...EMPTY_KEYS });
  const rafRef = useRef<number>(0);
  const cameraRef = useRef({ x: 0, y: 0 });

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedSpawn, setSelectedSpawn] = useState<WildPokemonSpawn | null>(
    null,
  );
  const [resultOpen, setResultOpen] = useState(false);
  const [result, setResult] = useState<WildCatchResult | null>(null);
  const [pokeballType, setPokeballType] = useState<PokeballType>(
    PokeballType.Pokeball,
  );
  const [secondsUntilReset, setSecondsUntilReset] = useState(0);
  const [isCatching, setIsCatching] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [catchingSprite, setCatchingSprite] = useState("");
  const [catchingName, setCatchingName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  // Active keys for the visual KeyHint only (re-renders are intentionally
  // separate from the rAF loop so the loop stays smooth)
  const [activeKeys, setActiveKeys] = useState<KeyMap>({ ...EMPTY_KEYS });

  const [isDaytime, setIsDaytime] = useState(() => {
    const hours = new Date().getHours();
    return hours >= 6 && hours < 18;
  });
  const catchingRef = useRef(false);
  const { isAuthenticated, isInitialized } = useAuth();
  const selectedAreaCode = searchParams.get("areaCode") || DEFAULT_AREA_CODE;

  const wildAreasQuery = useWildAreas(isAuthenticated);
  const wildAreaQuery = useWildArea(selectedAreaCode, isAuthenticated);
  const catchMutation = useAttemptWildCatch();
  const isLocalEnv =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");

  // ─── rAF panning loop ────────────────────────────────────────────────────
  const maxCamX = MAP_W - VIEWPORT_W;
  const maxCamY = MAP_H - VIEWPORT_H;

  const panLoop = useCallback(() => {
    const k = keysRef.current;
    const cam = cameraRef.current;
    let moved = false;

    if (k.left && cam.x > 0) {
      cam.x = Math.max(0, cam.x - PAN_SPEED);
      moved = true;
    }
    if (k.right && cam.x < maxCamX) {
      cam.x = Math.min(maxCamX, cam.x + PAN_SPEED);
      moved = true;
    }
    if (k.up && cam.y > 0) {
      cam.y = Math.max(0, cam.y - PAN_SPEED);
      moved = true;
    }
    if (k.down && cam.y < maxCamY) {
      cam.y = Math.min(maxCamY, cam.y + PAN_SPEED);
      moved = true;
    }

    if (moved && mapContentRef.current) {
      mapContentRef.current.style.transform = `translate3d(${-cam.x}px, ${-cam.y}px, 0)`;
    }

    rafRef.current = requestAnimationFrame(panLoop);
  }, [maxCamX, maxCamY]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(panLoop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [panLoop]);

  // ─── Keyboard listeners (only active when map is focused) ─────────────────
  useEffect(() => {
    if (!isFocused) {
      keysRef.current = { ...EMPTY_KEYS };
      setActiveKeys({ ...EMPTY_KEYS });
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      const dir = keyToDir(e.key);
      if (!dir) return;
      e.preventDefault(); // stop page scroll
      if (keysRef.current[dir]) return; // already pressed
      keysRef.current[dir] = true;
      setActiveKeys((prev) => ({ ...prev, [dir]: true }));
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const dir = keyToDir(e.key);
      if (!dir) return;
      keysRef.current[dir] = false;
      setActiveKeys((prev) => ({ ...prev, [dir]: false }));
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isFocused]);

  // ─── Day/night auto-update ────────────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const hours = new Date().getHours();
      setIsDaytime(hours >= 6 && hours < 18);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // ─── Reset state on area change ───────────────────────────────────────────
  useEffect(() => {
    if (searchParams.get("areaCode")) return;
    const next = new URLSearchParams(searchParams);
    next.set("areaCode", DEFAULT_AREA_CODE);
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setSelectedSpawn(null);
    setResultOpen(false);
    setResult(null);
    setPokeballType(PokeballType.Pokeball);
    // Reset camera when switching areas
    cameraRef.current = { x: 0, y: 0 };
    if (mapContentRef.current) {
      mapContentRef.current.style.transform = "translate3d(0,0,0)";
    }
  }, [selectedAreaCode]);

  // ─── Countdown timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!wildAreaQuery.data?.resetAt) {
      setSecondsUntilReset(0);
      return;
    }
    const calculateSecondsLeft = () => {
      const resetAtMs = new Date(wildAreaQuery.data!.resetAt).getTime();
      return Math.max(0, Math.ceil((resetAtMs - Date.now()) / 1000));
    };
    setSecondsUntilReset(calculateSecondsLeft());
    const timerId = window.setInterval(() => {
      setSecondsUntilReset(calculateSecondsLeft());
    }, 1000);
    return () => window.clearInterval(timerId);
  }, [wildAreaQuery.data?.resetAt]);

  const timerDisplay = useMemo(() => {
    const mins = Math.floor(Math.max(secondsUntilReset, 0) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(Math.max(secondsUntilReset, 0) % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  }, [secondsUntilReset]);

  // ─── Catch handlers ───────────────────────────────────────────────────────
  const animateShakes = async (shakes: number): Promise<void> => {
    return new Promise((resolve) => {
      let current = 0;
      const interval = window.setInterval(() => {
        current++;
        setShakeCount(current);
        if (current >= Math.min(shakes, 3)) {
          window.clearInterval(interval);
          resolve();
        }
      }, 650);
    });
  };

  const handleAttemptCatch = async () => {
    if (!isAuthenticated || !selectedSpawn || catchingRef.current) return;
    catchingRef.current = true;
    setShakeCount(0);
    // Preserve sprite/name before clearing selectedSpawn
    setCatchingSprite(
      toAnimatedSprite(selectedSpawn.spriteUrl) || "/substitute.png",
    );
    setCatchingName(selectedSpawn.pokemonName);
    setIsCatching(true);
    setSelectedSpawn(null);
    try {
      const response = await catchMutation.mutateAsync({
        spawnId: selectedSpawn.spawnId,
        payload: { pokeballType },
      });
      // Animate shakes before showing result
      await animateShakes(response.shakeCount);
      setResult(response);
      setResultOpen(true);
    } catch (error) {
      console.error(error);
      toast.error("Catch attempt failed. Please try again.");
    } finally {
      catchingRef.current = false;
      setIsCatching(false);
    }
  };

  const handleAreaChange = (areaCode: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("areaCode", areaCode);
    setSearchParams(next);
  };

  const handleResetEncounter = async () => {
    if (!isAuthenticated) return;
    setSelectedSpawn(null);
    setResultOpen(false);
    setResult(null);
    setPokeballType(PokeballType.Pokeball);
    try {
      await wildAreaService.refreshCurrent(selectedAreaCode);
      await wildAreaQuery.refetch();
      toast.success("Encounter reset with refresh endpoint.");
    } catch {
      await wildAreaQuery.refetch();
      toast(
        "Encounter state reset locally. Spawn refresh API is not available yet.",
      );
    }
  };

  // ─── Map content (spawns / loading / error states) ────────────────────────
  const renderMapContent = () => {
    if (!isInitialized) {
      return (
        <S.CenterHint>
          <Loading label="Checking session..." />
        </S.CenterHint>
      );
    }

    if (!isAuthenticated) {
      return (
        <S.CenterHint>
          <div style={{ display: "grid", gap: 10, textAlign: "center" }}>
            <Text variant="light">Please login to access Wild Area.</Text>
            <Link to="/login">
              <Button variant="light">Go to Login</Button>
            </Link>
          </div>
        </S.CenterHint>
      );
    }

    if (wildAreasQuery.isLoading || wildAreaQuery.isLoading) {
      return (
        <S.CenterHint>
          <Loading label="Loading wild area..." />
        </S.CenterHint>
      );
    }

    if (wildAreasQuery.isError || wildAreaQuery.isError) {
      return (
        <S.CenterHint>
          <Text variant="light">Failed to load Wild Area.</Text>
        </S.CenterHint>
      );
    }

    const spawns = wildAreaQuery.data?.spawns ?? [];

    return spawns.map((spawn) => {
      const position = spawnPositions[spawn.slotIndex] ?? { x: 20, y: 20 };
      const disabled =
        spawn.isConsumed || spawn.isCaught || spawn.attemptsLeft <= 0;

      return (
        <S.SpawnButton
          key={spawn.spawnId}
          x={position.x}
          y={position.y}
          disabled={disabled}
          onClick={() => {
            if (!disabled) setSelectedSpawn(spawn);
          }}
          title={`${spawn.pokemonName} (${spawn.spawnRarity})`}
        >
          <img
            src={toAnimatedSprite(spawn.spriteUrl) || "/substitute.png"}
            alt={spawn.pokemonName}
          />
        </S.SpawnButton>
      );
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>
      <S.Page style={{ marginBottom: navRef.current?.clientHeight ?? 120 }}>
        <Header
          title="Wild Area"
          subtitle="Encounter and catch limited spawns"
        />

        <S.TopRow>
          <S.AreaControls>
            {isAuthenticated && (
              <S.AreaSelect
                value={selectedAreaCode}
                onChange={(event) => handleAreaChange(event.target.value)}
                disabled={wildAreasQuery.isLoading || wildAreaQuery.isFetching}
                aria-label="Select wild area biome"
              >
                {(wildAreasQuery.data?.length
                  ? wildAreasQuery.data
                  : [{ code: DEFAULT_AREA_CODE, name: "Viridian Field" }]
                ).map((area) => (
                  <option key={area.code} value={area.code}>
                    {area.name}
                  </option>
                ))}
              </S.AreaSelect>
            )}
          </S.AreaControls>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <S.DayNightIndicator
              $isDay={isDaytime}
              title={
                isDaytime ? "Daytime (6 AM - 6 PM)" : "Nighttime (6 PM - 6 AM)"
              }
            >
              {isDaytime ? <SunIcon /> : <MoonIcon />}
              {isDaytime ? "Day" : "Night"}
            </S.DayNightIndicator>

            <S.TimerText>Reset in {timerDisplay}</S.TimerText>

            {isLocalEnv && isAuthenticated && (
              <Button
                variant="light"
                onClick={handleResetEncounter}
                disabled={wildAreaQuery.isFetching || catchMutation.isPending}
              >
                Reset Encounter
              </Button>
            )}
          </div>
        </S.TopRow>

        {/* ── Map viewport ── */}
        <S.MapShell
          ref={shellRef}
          $focused={isFocused}
          tabIndex={0}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onClick={() => shellRef.current?.focus()}
          aria-label="Wild Area map — click to focus, then use Arrow keys or WASD to pan"
        >
          {/* The large canvas that moves */}
          <S.MapContent
            ref={mapContentRef}
            $areaCode={selectedAreaCode}
            $isDay={isDaytime}
          >
            <S.GridOverlay />
            {renderMapContent()}
          </S.MapContent>

          {/* Keyboard hint overlay (bottom-right) */}
          {!isFocused && (
            <S.CenterHint
              style={{
                bottom: 10,
                top: "auto",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              <Text variant="light" style={{ fontSize: 14 }}>
                🕹 Click map · then use Arrow keys or WASD to pan
              </Text>
            </S.CenterHint>
          )}

          {isFocused && (
            <S.KeyHint aria-hidden="true">
              <S.KeyRow>
                <S.KeyCap $active={activeKeys.up}>▲</S.KeyCap>
              </S.KeyRow>
              <S.KeyRow>
                <S.KeyCap $active={activeKeys.left}>◄</S.KeyCap>
                <S.KeyCap $active={activeKeys.down}>▼</S.KeyCap>
                <S.KeyCap $active={activeKeys.right}>►</S.KeyCap>
              </S.KeyRow>
            </S.KeyHint>
          )}
        </S.MapShell>

        <S.Tip>
          {isAuthenticated
            ? "Tip: Click a wild Pokémon sprite to start an encounter."
            : "Tip: Login is required before you can catch from Wild Area."}
        </S.Tip>
      </S.Page>

      {/* ── Encounter modal (new cinematic design) ── */}
      {isAuthenticated && !isCatching && (
        <EncounterModal
          spawn={selectedSpawn}
          pokeballType={pokeballType}
          isCatching={catchMutation.isPending || isCatching}
          onPokeballChange={setPokeballType}
          onCancel={() => setSelectedSpawn(null)}
          onThrow={handleAttemptCatch}
          spriteSrc={
            toAnimatedSprite(selectedSpawn?.spriteUrl ?? "") ||
            "/substitute.png"
          }
        />
      )}

      {/* ── Catching animation modal ── */}
      <CatchingModal
        open={isCatching}
        spriteSrc={catchingSprite || "/substitute.png"}
        shakeCount={shakeCount}
        pokemonName={catchingName}
      />

      {/* ── Result modal (new cinematic design) ── */}
      <ResultModal
        open={resultOpen}
        result={result}
        onClose={() => {
          setResultOpen(false);
          setResult(null);
          setShakeCount(0);
        }}
      />

      <Navbar ref={navRef} />
    </>
  );
};

export default WildArea;
