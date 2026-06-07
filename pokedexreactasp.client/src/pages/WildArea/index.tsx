import { createRef, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

import { Button, Header, Loading, Modal, Navbar, Text } from "@/components/ui";
import { useAuth } from "@/contexts";
import { useWildArea, useWildAreas } from "@/hooks/queries";
import { useAttemptWildCatch } from "@/hooks/mutations";
import { wildAreaService } from "@/services/wild-area/wild-area.service";
import { PokeballType } from "@/types/pokemon.enums";
import { WildCatchResult, WildPokemonSpawn } from "@/types/wild-area.types";

import * as S from "./index.style";

const DEFAULT_AREA_CODE = "viridian_field";

const spawnPositions = [
  { x: 80, y: 98 },
  { x: 242, y: 76 },
  { x: 420, y: 120 },
  { x: 130, y: 260 },
  { x: 318, y: 250 },
  { x: 510, y: 292 },
];

const WildArea = () => {
  const navRef = createRef<HTMLDivElement>();
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
  }, [selectedAreaCode]);

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

  const secondsLeft = secondsUntilReset;
  const timerDisplay = useMemo(() => {
    const mins = Math.floor(Math.max(secondsLeft, 0) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(Math.max(secondsLeft, 0) % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  }, [secondsLeft]);

  const handleAttemptCatch = async () => {
    if (!isAuthenticated || !selectedSpawn || catchingRef.current) return;
    catchingRef.current = true;
    setIsCatching(true);

    try {
      const response = await catchMutation.mutateAsync({
        spawnId: selectedSpawn.spawnId,
        payload: { pokeballType },
      });
      setResult(response);
      setResultOpen(true);
      setSelectedSpawn(null);
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
      // Fallback for local environments where refresh endpoint is not implemented yet.
      await wildAreaQuery.refetch();
      toast(
        "Encounter state reset locally. Spawn refresh API is not available yet.",
      );
    }
  };

  const renderContent = () => {
    if (!isInitialized) {
      return <Loading label="Checking session..." />;
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
      return <Loading label="Loading wild area..." />;
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
            src={spawn.spriteUrl || "/substitute.png"}
            alt={spawn.pokemonName}
          />
          <S.SpawnBadge>{spawn.attemptsLeft}</S.SpawnBadge>
        </S.SpawnButton>
      );
    });
  };

  return (
    <>
      <S.Page style={{ marginBottom: navRef.current?.clientHeight ?? 120 }}>
        <Header
          title="Wild Area"
          subtitle="Encounter and catch limited spawns"
        />

        <S.TopRow>
          <S.AreaControls>
            <Text as="h3">
              {wildAreaQuery.data?.areaName || "Viridian Field"}
            </Text>
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
            <Text>Reset in {timerDisplay}</Text>
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

        <S.MapShell>
          <S.GridOverlay />
          {renderContent()}
        </S.MapShell>

        <S.Tip>
          {isAuthenticated
            ? "Tip: Click a wild Pokemon sprite to start an encounter."
            : "Tip: Login is required before you can catch from Wild Area."}
        </S.Tip>
      </S.Page>

      <Modal open={!!selectedSpawn && isAuthenticated}>
        {selectedSpawn && (
          <S.ModalCard>
            <Text as="h3">Encounter</Text>
            <S.ModalRow>
              <img
                src={selectedSpawn.spriteUrl || "/substitute.png"}
                alt={selectedSpawn.pokemonName}
              />
              <div>
                <Text as="h3">{selectedSpawn.pokemonName}</Text>
                <Text>
                  {selectedSpawn.spawnRarity} · Attempts left:{" "}
                  {selectedSpawn.attemptsLeft}
                </Text>
              </div>
            </S.ModalRow>

            <S.FormRow>
              <S.Select
                value={pokeballType}
                onChange={(e) =>
                  setPokeballType(Number(e.target.value) as PokeballType)
                }
                disabled={catchMutation.isPending || isCatching}
              >
                <option value={PokeballType.Pokeball}>Pokeball</option>
                <option value={PokeballType.GreatBall}>Great Ball</option>
                <option value={PokeballType.UltraBall}>Ultra Ball</option>
              </S.Select>
            </S.FormRow>

            <S.Actions>
              <Button
                variant="light"
                onClick={() => setSelectedSpawn(null)}
                disabled={catchMutation.isPending || isCatching}
              >
                Cancel
              </Button>
              <Button
                variant="dark"
                onClick={handleAttemptCatch}
                disabled={catchMutation.isPending || isCatching}
              >
                {catchMutation.isPending || isCatching
                  ? "Catching..."
                  : "Attempt Catch"}
              </Button>
            </S.Actions>
          </S.ModalCard>
        )}
      </Modal>

      <Modal open={resultOpen} overlay="light" solid>
        {result && (
          <S.ModalCard>
            <Text as="h3">
              {result.pokemonCaught ? "Catch Success" : "Catch Failed"}
            </Text>
            <Text style={{ marginTop: 8 }}>{result.message}</Text>
            <Text>
              Shake count: {result.shakeCount} · Attempts left:{" "}
              {result.attemptsLeft}
            </Text>
            <Text>Spawn consumed: {result.spawnConsumed ? "Yes" : "No"}</Text>

            {result.cardReward && (
              <S.RewardCard>
                <img
                  src={result.cardReward.imageSmall || "/substitute.png"}
                  alt={result.cardReward.name}
                />
                <div>
                  <Text as="h3">Card Reward</Text>
                  <Text>{result.cardReward.name}</Text>
                  <Text>
                    {result.cardReward.rarity || "Unknown"} ·{" "}
                    {result.cardReward.rarityTier}
                  </Text>
                </div>
              </S.RewardCard>
            )}

            <S.Actions>
              <Button
                variant="dark"
                onClick={() => {
                  setResultOpen(false);
                  setResult(null);
                }}
              >
                Close
              </Button>
            </S.Actions>
          </S.ModalCard>
        )}
      </Modal>

      <Navbar ref={navRef} />
    </>
  );
};

export default WildArea;
