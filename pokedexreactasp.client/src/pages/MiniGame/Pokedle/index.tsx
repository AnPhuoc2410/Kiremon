import { useState, useEffect, useCallback, useMemo } from "react";
import {
  IconSearch,
  IconX,
  IconFilterOff,
  IconTrophy,
  IconClock,
} from "@tabler/icons-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLanguage } from "@/contexts";
import { t } from "@/utils/uiI18n";
import {
  Header,
  Text,
  Button,
  Input,
  PokeCard,
  SkeletonCard,
} from "@/components/ui";
import { pokemonService, typesService } from "@/services";
import { speciesService } from "@/services/pokemon/species.service";
import { IPokemonDetailResponse, IPokemon } from "@/types/pokemon";
import { sfx } from "@/components/utils/sfx";
import {
  GameContainer,
  GameCard,
  HeaderArea,
  ModeSwitch,
  ModeButton,
  GridContainer,
  GridTable,
  GridHeader,
  GridRow,
  TileCell,
  WinOverlay,
  WinCard,
  SearchModalOverlay,
  SearchModalPanel,
  SearchModalHeader,
  SearchModalGrid,
  GuessButton,
  FilterBar,
  FilterSection,
  FilterLabel,
  FilterChips,
  FilterChip,
  ClearFilters,
} from "./index.style";

const MAX_POKEMON_ID = 898;
const PAGE_SIZE = 30;

/** Generation ID ranges (Gen I – IX up to #898) */
const GEN_RANGES: Record<number, [number, number]> = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 898],
};

const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

interface IGuessResult {
  pokemon: IPokemonDetailResponse;
  gen: number;
  stage: number;
  color: string;
  type1Status: "correct" | "partial" | "incorrect";
  type2Status: "correct" | "partial" | "incorrect";
  genStatus: "correct" | "incorrect";
  genArrow: "up" | "down" | "none";
  colorStatus: "correct" | "incorrect";
  stageStatus: "correct" | "incorrect";
  stageArrow: "up" | "down" | "none";
}

interface IPokemonEntry {
  name: string;
  id: number;
}

const ROMAN_TO_NUM: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
};

function getGenerationNum(genName: string): number {
  if (!genName) return 1;
  const roman = genName.split("-")[1];
  return ROMAN_TO_NUM[roman] || 1;
}

/**
 * Estimate evolution stage purely from species data (no evolution-chain fetch needed).
 * Stage 1 = no pre-evolution, Stage 2 = has pre-evo, Stage 3 = pre-evo also has a pre-evo.
 * For stage 3 detection we rely on known 3-stage families heuristic:
 * if evolves_from_species is not null AND the species has_gender_differences or capture_rate <= 45
 * we can't be 100% sure, so we default stage 2 unless we already fetched the chain.
 * Simple rule: null → 1, non-null → 2 (will be wrong for stage-3 Pokémon,
 * but avoids the slow evolution-chain fetch entirely).
 * Pass the preloaded chain if available for accuracy.
 */
function getEvolutionStage(
  chain: import("@/types/pokemon.d").IChainLink | null,
  pokemonName: string,
): number {
  if (!chain) return 1;
  if (chain.species.name === pokemonName) return 1;
  for (const next of chain.evolves_to ?? []) {
    if (next.species.name === pokemonName) return 2;
    for (const final of next.evolves_to ?? []) {
      if (final.species.name === pokemonName) return 3;
    }
  }
  return 1;
}

function getStageFromSpecies(
  species: { evolves_from_species: { name: string } | null } | null,
  chain: import("@/types/pokemon.d").IChainLink | null,
  pokemonName: string,
): number {
  if (chain) return getEvolutionStage(chain, pokemonName);
  if (!species) return 1;
  return species.evolves_from_species ? 2 : 1;
}

function getSeededRandom(min: number, max: number) {
  const date = new Date();
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const x = Math.sin(seed) * 10000;
  const rand = x - Math.floor(x);
  return Math.floor(rand * (max - min + 1)) + min;
}

function getRandomPokemonId() {
  return Math.floor(Math.random() * MAX_POKEMON_ID) + 1;
}

/** Parse IPokemon[] → flat {name, id}[] once */
function parsePokemonList(raw: IPokemon[]): IPokemonEntry[] {
  return raw.map((p) => {
    const id = p.url
      ? parseInt(p.url.split("/").filter(Boolean).at(-1)!, 10)
      : 0;
    return { name: p.name, id };
  });
}

export const Pokedle = () => {
  const { languageId } = useLanguage();
  const [mode, setMode] = useState<"daily" | "unlimited">("unlimited");
  const [targetPokemon, setTargetPokemon] =
    useState<IPokemonDetailResponse | null>(null);
  const [targetDetails, setTargetDetails] = useState<{
    gen: number;
    stage: number;
    color: string;
  } | null>(null);
  const [finalGuessCount, setFinalGuessCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState("");
  const [showWinModal, setShowWinModal] = useState(false);

  const [allPokemon, setAllPokemon] = useState<IPokemonEntry[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState("");
  const [filterGen, setFilterGen] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const [typeFilteredIds, setTypeFilteredIds] = useState<Set<number> | null>(
    null,
  );
  const [displayedItems, setDisplayedItems] = useState<IPokemonEntry[]>([]);
  const [displayPage, setDisplayPage] = useState(1);

  const [guesses, setGuesses] = useState<IGuessResult[]>([]);
  const [gameState, setGameState] = useState<"playing" | "won">("playing");

  // Load all pokemon names once
  useEffect(() => {
    const fetchAll = async () => {
      const response = await pokemonService.getAllPokemon(MAX_POKEMON_ID, 0);
      setAllPokemon(parsePokemonList(response.results));
    };
    fetchAll();
  }, []);

  // Initialize game
  useEffect(() => {
    startNewGame();
  }, [mode]);

  const startNewGame = async () => {
    let alreadyWonDaily = false;
    let savedGuessCount = 0;
    if (mode === "daily") {
      try {
        const saved = JSON.parse(localStorage.getItem("pokedle_daily") || "{}");
        if (saved.date === new Date().toDateString() && saved.won) {
          alreadyWonDaily = true;
          savedGuessCount = saved.guessCount;
        }
      } catch (e) {}
    }

    setGameState(alreadyWonDaily ? "won" : "playing");
    setShowWinModal(alreadyWonDaily);
    setGuesses([]);
    if (alreadyWonDaily) {
      setFinalGuessCount(savedGuessCount);
    }

    const newTargetId =
      mode === "daily"
        ? getSeededRandom(1, MAX_POKEMON_ID)
        : getRandomPokemonId();

    // Parallel fetch
    const [detail, speciesData] = await Promise.all([
      pokemonService.getPokemonDetail(newTargetId.toString()),
      speciesService.getSpeciesWithEvolution(newTargetId.toString()),
    ]);
    if (detail) setTargetPokemon(detail);
    if (speciesData?.species) {
      setTargetDetails({
        gen: getGenerationNum(speciesData.species.generation.name),
        stage: getEvolutionStage(
          speciesData.evolution?.chain || null,
          speciesData.species.name,
        ),
        color: speciesData.species.color.name,
      });
    }
  };

  useEffect(() => {
    if (mode !== "daily" || gameState !== "won") return;
    const interval = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setHours(24, 0, 0, 0);
      const diff = tomorrow.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const m = Math.floor((diff / 1000 / 60) % 60)
        .toString()
        .padStart(2, "0");
      const s = Math.floor((diff / 1000) % 60)
        .toString()
        .padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [mode, gameState]);

  useEffect(() => {
    if (!filterType) {
      setTypeFilteredIds(null);
      return;
    }
    let isActive = true;
    const fetchType = async () => {
      const typeDetails = await typesService.getTypeDetails(filterType);
      if (!isActive || !typeDetails) return;
      const ids = new Set<number>();
      type TypePokemonEntry = {
        pokemon: { name: string; url: string };
        slot: number;
      };
      const pokemonList = typeDetails.pokemon as unknown as TypePokemonEntry[];

      for (const p of pokemonList) {
        if (!p.pokemon.url) continue;
        const parts = p.pokemon.url.split("/").filter(Boolean);
        const id = parseInt(parts[parts.length - 1], 10);
        ids.add(id);
      }
      setTypeFilteredIds(ids);
    };
    fetchType();
    return () => {
      isActive = false;
    };
  }, [filterType]);

  // Filtered list for modal (name + gen + type)
  const filteredPokemon = useMemo<IPokemonEntry[]>(() => {
    let list = allPokemon;

    // Gen filter — pure ID range, no API call needed
    if (filterGen !== null) {
      const [lo, hi] = GEN_RANGES[filterGen] ?? [1, MAX_POKEMON_ID];
      list = list.filter((p) => p.id >= lo && p.id <= hi);
    }

    // Type filter
    if (filterType !== null) {
      if (typeFilteredIds === null) {
        return []; // wait for fetch
      }
      list = list.filter((p) => typeFilteredIds.has(p.id));
    }

    // Name search
    const term = modalSearch.trim().toLowerCase();
    if (term) list = list.filter((p) => p.name.includes(term));

    return list;
  }, [modalSearch, filterGen, filterType, typeFilteredIds, allPokemon]);

  // Slice to current display page
  const hasMoreInModal = displayedItems.length < filteredPokemon.length;

  const loadMoreInModal = useCallback(() => {
    const nextPage = displayPage + 1;
    setDisplayedItems(filteredPokemon.slice(0, nextPage * PAGE_SIZE));
    setDisplayPage(nextPage);
  }, [displayPage, filteredPokemon]);

  // Reset pagination when search changes or modal opens
  useEffect(() => {
    setDisplayPage(1);
    setDisplayedItems(filteredPokemon.slice(0, PAGE_SIZE));
  }, [filteredPokemon, isModalOpen]);

  const openModal = () => {
    setModalSearch("");
    setFilterGen(null);
    setFilterType(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalSearch("");
    setFilterGen(null);
    setFilterType(null);
  };

  const evaluateGuess = async (pokemonName: string) => {
    if (!targetPokemon || !targetDetails) return;
    closeModal();
    setIsSearching(true);
    try {
      // Run detail + species in parallel (2 calls instead of 3)
      const [guessDetail, speciesData] = await Promise.all([
        pokemonService.getPokemonDetail(pokemonName),
        speciesService.getSpeciesWithEvolution(pokemonName),
      ]);
      if (!guessDetail) return;
      const { species, evolution } = speciesData;
      if (!species) return;

      const guessGen = getGenerationNum(species.generation.name);
      const guessStage = getStageFromSpecies(
        species,
        evolution?.chain ?? null,
        species.name,
      );
      const guessColor = species.color.name;

      const tTypes = targetPokemon.types.map((t) => t.type.name);
      const gTypes = guessDetail.types.map((t) => t.type.name);

      let type1Status: "correct" | "partial" | "incorrect" = "incorrect";
      if (gTypes[0] === tTypes[0]) type1Status = "correct";
      else if (tTypes.includes(gTypes[0])) type1Status = "partial";

      let type2Status: "correct" | "partial" | "incorrect" = "incorrect";
      const gType2 = gTypes[1] || "none";
      const tType2 = tTypes[1] || "none";
      if (gType2 === tType2) type2Status = "correct";
      else if (gType2 !== "none" && tTypes.includes(gType2))
        type2Status = "partial";

      const genStatus =
        guessGen === targetDetails.gen ? "correct" : "incorrect";
      const genArrow =
        guessGen === targetDetails.gen
          ? "none"
          : guessGen > targetDetails.gen
            ? "down"
            : "up";
      const colorStatus =
        guessColor === targetDetails.color ? "correct" : "incorrect";
      const stageStatus =
        guessStage === targetDetails.stage ? "correct" : "incorrect";
      const stageArrow =
        guessStage === targetDetails.stage
          ? "none"
          : guessStage > targetDetails.stage
            ? "down"
            : "up";

      setGuesses((prev) => [
        {
          pokemon: guessDetail,
          gen: guessGen,
          stage: guessStage,
          color: guessColor,
          type1Status,
          type2Status,
          genStatus,
          genArrow,
          colorStatus,
          stageStatus,
          stageArrow,
        },
        ...prev,
      ]);

      if (guessDetail.name === targetPokemon.name) {
        setGameState("won");
        setShowWinModal(true);
        const totalGuesses = guesses.length + 1;
        setFinalGuessCount(totalGuesses);
        if (mode === "daily") {
          localStorage.setItem(
            "pokedle_daily",
            JSON.stringify({
              date: new Date().toDateString(),
              won: true,
              guessCount: totalGuesses,
            }),
          );
        }
        sfx.success();
      } else {
        sfx.click();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <Header title={t("games.pokedle", languageId)} backTo="/" />
      <GameContainer>
        <GameCard className="pxl-border">
          <HeaderArea>
            <Text variant="default">{t("games.pokedle", languageId)}</Text>
            <ModeSwitch>
              <ModeButton
                isActive={mode === "daily"}
                onClick={() => setMode("daily")}
              >
                Daily
              </ModeButton>
              <ModeButton
                isActive={mode === "unlimited"}
                onClick={() => setMode("unlimited")}
              >
                Unlimited
              </ModeButton>
            </ModeSwitch>
          </HeaderArea>

          <Text>{t("games.pokedle.howToPlayDesc", languageId)}</Text>

          {gameState === "playing" && (
            <GuessButton
              onClick={openModal}
              disabled={isSearching || allPokemon.length === 0}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {isSearching ? (
                "Evaluating..."
              ) : (
                <>
                  <IconSearch size={20} /> Guess a Pokémon
                </>
              )}
            </GuessButton>
          )}

          {gameState === "won" && targetPokemon && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                padding: "24px 0",
              }}
            >
              <img
                src={targetPokemon.sprites.front_default}
                alt={targetPokemon.name}
                style={{
                  width: 120,
                  height: 120,
                  filter: "drop-shadow(0 8px 16px rgba(74, 222, 128, 0.4))",
                }}
              />
              <Text
                variant="default"
                style={{
                  textTransform: "capitalize",
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#4ade80",
                }}
              >
                {targetPokemon.name}
              </Text>
              <Text>
                You guessed it in <strong>{finalGuessCount}</strong>{" "}
                {finalGuessCount === 1 ? "try" : "tries"}!
              </Text>

              {mode === "daily" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "8px",
                    padding: "16px",
                    backgroundColor: "rgba(0,0,0,0.03)",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "320px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <IconClock size={20} />
                    <Text>Next daily Pokémon in:</Text>
                  </div>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      fontFamily: "monospace",
                    }}
                  >
                    {timeLeft}
                  </Text>
                </div>
              )}
              {mode === "unlimited" && (
                <Button
                  variant="primary"
                  onClick={startNewGame}
                  style={{ marginTop: "8px" }}
                >
                  Play Again
                </Button>
              )}
            </div>
          )}

          {guesses.length > 0 && (
            <GridContainer>
              <GridTable>
                <GridHeader>
                  <span>Pokémon</span>
                  <span>Type 1</span>
                  <span>Type 2</span>
                  <span>Gen</span>
                  <span>Color</span>
                  <span>Stage</span>
                </GridHeader>
                {guesses.map((g, idx) => (
                  <GridRow key={idx}>
                    <TileCell status="default">
                      <img
                        src={g.pokemon.sprites.front_default}
                        alt={g.pokemon.name}
                      />
                    </TileCell>
                    <TileCell status={g.type1Status}>
                      {g.pokemon.types[0].type.name}
                    </TileCell>
                    <TileCell status={g.type2Status}>
                      {g.pokemon.types[1]?.type.name || "None"}
                    </TileCell>
                    <TileCell status={g.genStatus}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        Gen {g.gen}
                        {g.genArrow === "up" && (
                          <span className="arrow">▲</span>
                        )}
                        {g.genArrow === "down" && (
                          <span className="arrow">▼</span>
                        )}
                      </div>
                    </TileCell>
                    <TileCell status={g.colorStatus}>{g.color}</TileCell>
                    <TileCell status={g.stageStatus}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {g.stage}
                        {g.stageArrow === "up" && (
                          <span className="arrow">▲</span>
                        )}
                        {g.stageArrow === "down" && (
                          <span className="arrow">▼</span>
                        )}
                      </div>
                    </TileCell>
                  </GridRow>
                ))}
              </GridTable>
            </GridContainer>
          )}
        </GameCard>
      </GameContainer>

      {/* Win Modal — full screen */}
      {gameState === "won" && targetPokemon && showWinModal && (
        <WinOverlay onClick={() => setShowWinModal(false)}>
          <WinCard className="pxl-border" onClick={(e) => e.stopPropagation()}>
            <IconTrophy size={48} color="#4ade80" />
            <h2>You got it!</h2>
            <img
              src={targetPokemon.sprites.front_default}
              alt={targetPokemon.name}
            />
            <Text
              variant="default"
              style={{
                textTransform: "capitalize",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              {targetPokemon.name}
            </Text>
            <Text>
              You guessed it in <strong>{finalGuessCount}</strong>{" "}
              {finalGuessCount === 1 ? "try" : "tries"}!
            </Text>
            {mode === "unlimited" && (
              <Button variant="primary" onClick={startNewGame}>
                Play Again
              </Button>
            )}
            {mode === "daily" && (
              <>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <IconClock size={20} />
                  <Text>Next daily Pokémon in:</Text>
                </div>
                <Text
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    fontFamily: "monospace",
                  }}
                >
                  {timeLeft}
                </Text>
              </>
            )}
          </WinCard>
        </WinOverlay>
      )}
      {isModalOpen && (
        <SearchModalOverlay onClick={closeModal}>
          <SearchModalPanel onClick={(e) => e.stopPropagation()}>
            <SearchModalHeader>
              <Input
                autoFocus
                placeholder="Search Pokémon..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
              />
              <button
                onClick={closeModal}
                aria-label="Close"
                style={{ display: "flex", alignItems: "center" }}
              >
                <IconX size={24} />
              </button>
            </SearchModalHeader>

            {/* Gen filter chips */}
            <FilterBar>
              <FilterSection>
                <FilterLabel>Gen</FilterLabel>
                <FilterChips>
                  {Object.keys(GEN_RANGES).map((g) => {
                    const gen = Number(g);
                    const roman = [
                      "I",
                      "II",
                      "III",
                      "IV",
                      "V",
                      "VI",
                      "VII",
                      "VIII",
                    ][gen - 1];
                    return (
                      <FilterChip
                        key={gen}
                        isActive={filterGen === gen}
                        onClick={() =>
                          setFilterGen(filterGen === gen ? null : gen)
                        }
                      >
                        {roman}
                      </FilterChip>
                    );
                  })}
                </FilterChips>
              </FilterSection>

              <FilterSection>
                <FilterLabel>Type</FilterLabel>
                <FilterChips>
                  {POKEMON_TYPES.map((type) => (
                    <FilterChip
                      key={type}
                      isActive={filterType === type}
                      typeColor={type}
                      onClick={() =>
                        setFilterType(filterType === type ? null : type)
                      }
                    >
                      {type}
                    </FilterChip>
                  ))}
                </FilterChips>
              </FilterSection>

              {(filterGen !== null || filterType !== null || modalSearch) && (
                <ClearFilters
                  onClick={() => {
                    setFilterGen(null);
                    setFilterType(null);
                    setModalSearch("");
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <IconFilterOff size={16} /> Clear filters
                </ClearFilters>
              )}
            </FilterBar>

            <div
              id="pokedle-modal-scroll"
              style={{ overflowY: "auto", flex: 1 }}
            >
              <InfiniteScroll
                dataLength={displayedItems.length}
                next={loadMoreInModal}
                hasMore={hasMoreInModal}
                loader={
                  <SearchModalGrid>
                    {Array(8)
                      .fill(0)
                      .map((_, i) => (
                        <SkeletonCard key={`sk-${i}`} />
                      ))}
                  </SearchModalGrid>
                }
                scrollableTarget="pokedle-modal-scroll"
              >
                <SearchModalGrid>
                  {displayedItems.map((p) => (
                    <PokeCard
                      key={p.id}
                      pokemonId={p.id}
                      name={p.name}
                      onClick={() => evaluateGuess(p.name)}
                    />
                  ))}
                </SearchModalGrid>
              </InfiniteScroll>
            </div>
          </SearchModalPanel>
        </SearchModalOverlay>
      )}
    </>
  );
};

export default Pokedle;
