import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Header, Text, Button } from "@/components/ui";
import SEOWrapper from "@/components/ui/SEOWrapper";
import { sfx } from "@/components/utils/sfx";
import { pokemonService } from "@/services";
import {
  GameContainer,
  ControlBar,
  ChipGroup,
  FilterChip,
  StatsBar,
  StatBadge,
  StageCard,
  DisplayScreen,
  PokemonSpriteImg,
  HintsSection,
  HintPill,
  OptionsGrid,
  OptionChoiceBtn,
  TypingForm,
  InputWrapper,
  GuessInput,
  SuggestionsDropdown,
  SuggestionItem,
  RevealCard,
  ActionsRow,
} from "./index.style";

interface PokemonListItem {
  name: string;
  url: string;
}

const GEN_RANGES: Record<string, { label: string; min: number; max: number }> =
  {
    gen1: { label: "Gen I", min: 1, max: 151 },
    gen2: { label: "Gen II", min: 152, max: 251 },
    gen3: { label: "Gen III", min: 252, max: 386 },
    gen4: { label: "Gen IV", min: 387, max: 493 },
    all: { label: "All Gens (1-8)", min: 1, max: 898 },
  };

const WhosThatPokemon: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [selectedGen, setSelectedGen] = useState<string>("all");
  const [gameMode, setGameMode] = useState<"choice" | "typing">("choice");

  const [currentId, setCurrentId] = useState<number | null>(null);
  const [pokemonName, setPokemonName] = useState<string>("");
  const [spriteUrl, setSpriteUrl] = useState<string>("");
  const [details, setDetails] = useState<{
    types: string[];
    gen: string;
  } | null>(null);
  const [choices, setChoices] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // Typing mode states
  const [guessText, setGuessText] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Hints
  const [showTypeHint, setShowTypeHint] = useState(false);
  const [showLetterHint, setShowLetterHint] = useState(false);

  // Scores
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState<number>(() =>
    Number(localStorage.getItem("pokegames@whosThatBest") || 0),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch complete Pokémon list once
  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=898");
        const data = await res.json();
        setPokemonList(data.results || []);
      } catch (err) {
        console.error("Failed to load pokemon list:", err);
      }
    };
    fetchList();
  }, []);

  // Filtered Pokémon list by selected Gen
  const currentGenPool = useMemo(() => {
    if (!pokemonList.length) return [];
    const { min, max } = GEN_RANGES[selectedGen] || GEN_RANGES.all;
    return pokemonList.slice(min - 1, max);
  }, [pokemonList, selectedGen]);

  // Load a new random Pokémon
  const loadRandomPokemon = useCallback(async () => {
    if (!currentGenPool.length) return;

    setLoading(true);
    setRevealed(false);
    setSelectedChoice(null);
    setIsCorrect(null);
    setGuessText("");
    setShowSuggestions(false);
    setShowTypeHint(false);
    setShowLetterHint(false);

    const randomIndex = Math.floor(Math.random() * currentGenPool.length);
    const target = currentGenPool[randomIndex];
    const { min } = GEN_RANGES[selectedGen] || GEN_RANGES.all;
    const realId = min + randomIndex;

    setCurrentId(realId);
    setPokemonName(target.name);
    setSpriteUrl(
      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${realId}.png`,
    );

    // Pick 3 random decoys from currentGenPool for choice mode
    const decoyPool = currentGenPool.filter((p) => p.name !== target.name);
    const shuffledDecoys = [...decoyPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const roundChoices = [
      target.name,
      ...shuffledDecoys.map((d) => d.name),
    ].sort(() => Math.random() - 0.5);
    setChoices(roundChoices);

    // Background fetch details for hints
    pokemonService
      .getPokemonDetail(realId)
      .then((data) => {
        if (data) {
          const types = data.types.map((t) => t.type.name);
          setDetails({
            types,
            gen: selectedGen.toUpperCase(),
          });
        }
      })
      .catch(() => {});

    setLoading(false);
  }, [currentGenPool, selectedGen]);

  // Initial load once list is ready
  useEffect(() => {
    if (currentGenPool.length > 0 && !pokemonName) {
      loadRandomPokemon();
    }
  }, [currentGenPool, pokemonName, loadRandomPokemon]);

  // On Gen change, load new Pokemon
  const handleGenChange = (genKey: string) => {
    if (genKey === selectedGen) return;
    sfx.click();
    setSelectedGen(genKey);
    setPokemonName("");
  };

  const handleModeChange = (mode: "choice" | "typing") => {
    if (mode === gameMode) return;
    sfx.click();
    setGameMode(mode);
  };

  const processResult = (correct: boolean, choiceChosen?: string) => {
    if (revealed) return;
    setRevealed(true);
    setIsCorrect(correct);
    if (choiceChosen) setSelectedChoice(choiceChosen);

    if (correct) {
      sfx.success();
      // Calculate score modifier based on hints used
      let points = 100;
      if (showTypeHint) points -= 25;
      if (showLetterHint) points -= 25;
      setScore((s) => s + Math.max(50, points));

      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((prev) => {
        const nextBest = Math.max(prev, newStreak);
        localStorage.setItem("pokegames@whosThatBest", String(nextBest));
        return nextBest;
      });
    } else {
      sfx.fail();
      setStreak(0);
    }
  };

  // Choice mode selection
  const handleChoiceClick = (choice: string) => {
    if (revealed || loading) return;
    sfx.click();
    const correct = choice.toLowerCase() === pokemonName.toLowerCase();
    processResult(correct, choice);
  };

  // Typing mode submission
  const handleTypingSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (revealed || loading || !guessText.trim()) return;

    const normalizedGuess = guessText.trim().toLowerCase();
    const correct = normalizedGuess === pokemonName.toLowerCase();
    processResult(correct);
  };

  // Autocomplete suggestions
  const autocompleteSuggestions = useMemo(() => {
    if (!guessText || guessText.length < 2 || revealed) return [];
    const query = guessText.toLowerCase();
    return currentGenPool
      .filter((p) => p.name.toLowerCase().includes(query))
      .slice(0, 6)
      .map((p) => p.name);
  }, [guessText, currentGenPool, revealed]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space or Enter to proceed to next Pokemon when revealed
      if (revealed && (e.key === " " || e.key === "Enter")) {
        e.preventDefault();
        loadRandomPokemon();
        return;
      }

      // 1-4 keys in choice mode when not yet revealed
      if (!revealed && gameMode === "choice" && choices.length === 4) {
        if (e.key === "1") handleChoiceClick(choices[0]);
        if (e.key === "2") handleChoiceClick(choices[1]);
        if (e.key === "3") handleChoiceClick(choices[2]);
        if (e.key === "4") handleChoiceClick(choices[3]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [revealed, gameMode, choices, loadRandomPokemon]);

  return (
    <>
      <SEOWrapper
        title="Who's That Pokémon? - Kiremon"
        description="Đoán tên Pokémon qua cái bóng (Silhouette). Đầy đủ chế độ trắc nghiệm & gõ phím, chọn thế hệ Gen 1-8!"
      />
      <Header
        title="Who's That Pokémon?"
        subtitle="Can you recognize the silhouette? Test your Pokémon mastery!"
        backTo="/"
      />
      <GameContainer>
        {/* Controls Bar: Gen selection & Mode */}
        <ControlBar>
          <ChipGroup>
            {Object.entries(GEN_RANGES).map(([key, item]) => (
              <FilterChip
                key={key}
                isActive={selectedGen === key}
                onClick={() => handleGenChange(key)}
              >
                {item.label}
              </FilterChip>
            ))}
          </ChipGroup>

          <StatsBar>
            <StatBadge variant="streak">
              🔥 Streak: {streak} (Best: {bestStreak})
            </StatBadge>
            <StatBadge variant="score">⭐ {score} pts</StatBadge>
          </StatsBar>
        </ControlBar>

        {/* Game Mode selector */}
        <div style={{ marginBottom: 14, display: "flex", gap: 8 }}>
          <FilterChip
            isActive={gameMode === "choice"}
            onClick={() => handleModeChange("choice")}
          >
            🎯 4 Choices (Keys 1-4)
          </FilterChip>
          <FilterChip
            isActive={gameMode === "typing"}
            onClick={() => handleModeChange("typing")}
          >
            ⌨️ Keyboard Typing
          </FilterChip>
        </div>

        {/* Main Console Stage */}
        <StageCard>
          {loading ? (
            <div
              style={{
                height: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Loading Mystery Pokémon...</Text>
            </div>
          ) : (
            <>
              {/* Silhouette Screen */}
              <DisplayScreen>
                {spriteUrl && (
                  <PokemonSpriteImg
                    src={spriteUrl}
                    alt={revealed ? pokemonName : "Mystery Pokémon Silhouette"}
                    revealed={revealed}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                  />
                )}
              </DisplayScreen>

              {/* Hints */}
              {!revealed && (
                <HintsSection>
                  <HintPill
                    revealed={showTypeHint}
                    onClick={() => {
                      sfx.click();
                      setShowTypeHint(true);
                    }}
                    disabled={showTypeHint}
                  >
                    💡{" "}
                    {showTypeHint && details?.types
                      ? `Type: ${details.types.join(" / ")}`
                      : "Hint 1: Reveal Type (-25 pts)"}
                  </HintPill>

                  <HintPill
                    revealed={showLetterHint}
                    onClick={() => {
                      sfx.click();
                      setShowLetterHint(true);
                    }}
                    disabled={showLetterHint}
                  >
                    🔍{" "}
                    {showLetterHint
                      ? `Starts with '${pokemonName.charAt(0).toUpperCase()}'`
                      : "Hint 2: Initial Letter (-25 pts)"}
                  </HintPill>
                </HintsSection>
              )}

              {/* Multiple Choice Mode */}
              {!revealed && gameMode === "choice" && (
                <OptionsGrid>
                  {choices.map((choice, idx) => (
                    <OptionChoiceBtn
                      key={choice}
                      onClick={() => handleChoiceClick(choice)}
                    >
                      <span>{choice.replace(/-/g, " ")}</span>
                      <span className="key-tag">{idx + 1}</span>
                    </OptionChoiceBtn>
                  ))}
                </OptionsGrid>
              )}

              {/* Typing Mode */}
              {!revealed && gameMode === "typing" && (
                <TypingForm onSubmit={handleTypingSubmit}>
                  <InputWrapper>
                    <GuessInput
                      ref={inputRef}
                      type="text"
                      value={guessText}
                      onChange={(e) => {
                        setGuessText(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={(e) => {
                        // modern-web-guidance: IME-safe Enter submit check
                        if (e.key === "Enter") {
                          if (
                            e.nativeEvent.isComposing ||
                            (e as any).keyCode === 229
                          ) {
                            return;
                          }
                          e.preventDefault();
                          handleTypingSubmit();
                        }
                      }}
                      placeholder="Type Pokémon name..."
                      autoComplete="off"
                      autoFocus
                    />

                    {showSuggestions && autocompleteSuggestions.length > 0 && (
                      <SuggestionsDropdown>
                        {autocompleteSuggestions.map((suggestion) => (
                          <SuggestionItem
                            key={suggestion}
                            onMouseDown={() => {
                              setGuessText(suggestion);
                              setShowSuggestions(false);
                            }}
                          >
                            {suggestion.replace(/-/g, " ")}
                          </SuggestionItem>
                        ))}
                      </SuggestionsDropdown>
                    )}
                  </InputWrapper>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      justifyContent: "center",
                    }}
                  >
                    <Button type="submit" variant="sky">
                      Submit Guess
                    </Button>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => processResult(false)}
                    >
                      Give Up
                    </Button>
                  </div>
                </TypingForm>
              )}

              {/* Revealed State */}
              {revealed && (
                <>
                  <RevealCard isCorrect={Boolean(isCorrect)}>
                    <Text
                      as="h3"
                      style={{
                        margin: 0,
                        textTransform: "capitalize",
                        fontSize: 20,
                      }}
                    >
                      {isCorrect ? "🎉 Correct! It's " : "❌ It's "}
                      <strong
                        style={{ color: isCorrect ? "#059669" : "#dc2626" }}
                      >
                        {pokemonName.replace(/-/g, " ").toUpperCase()}!
                      </strong>
                    </Text>
                    {details?.types && (
                      <div
                        style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}
                      >
                        Type: {details.types.join(" / ")}
                      </div>
                    )}
                  </RevealCard>

                  <ActionsRow>
                    <Button variant="sky" onClick={loadRandomPokemon}>
                      Next Pokémon (Press Space)
                    </Button>
                    <Button
                      variant="light"
                      onClick={() => navigate(`/pokemon/${pokemonName}`)}
                    >
                      📖 View Pokédex Entry
                    </Button>
                  </ActionsRow>
                </>
              )}
            </>
          )}
        </StageCard>
      </GameContainer>
    </>
  );
};

export default WhosThatPokemon;
