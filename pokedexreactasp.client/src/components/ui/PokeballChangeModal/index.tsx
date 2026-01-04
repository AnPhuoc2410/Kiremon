import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { pokeItemService } from "../../../services/pokeitem/pokeitem.service";
import { useDebounce } from "../../hooks/useDebounce";
import * as S from "./index.style";

interface Pokeball {
  name: string;
  sprite: string;
}

interface PokeballChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokeball: (name: string) => void;
  currentPokeball?: string;
}

const PokeballChangeModal: React.FC<PokeballChangeModalProps> = ({
  isOpen,
  onClose,
  onSelectPokeball,
  currentPokeball,
}) => {
  const [pokeballs, setPokeballs] = useState<Pokeball[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const [selectedPokeball, setSelectedPokeball] = useState<string>(
    currentPokeball || "timer-ball",
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load pokeballs when modal opens
  useEffect(() => {
    if (isOpen && pokeballs.length === 0) {
      loadPokeballs();
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedPokeball(currentPokeball || "timer-ball");
    }
  }, [isOpen, currentPokeball]);

  const loadPokeballs = async () => {
    setIsLoading(true);
    try {
      const balls = await pokeItemService.getAllPokeballs();
      setPokeballs(balls);
    } catch (error) {
      console.error("Failed to load Pokéballs:", error);
      toast.error("Failed to load Pokéballs");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter pokeballs based on debounced search
  const displayPokeballs = pokeballs.filter((ball) =>
    ball.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedPokeball) {
      toast.error("Please select a Pokéball");
      return;
    }

    onSelectPokeball(selectedPokeball);
    toast.success("Pokéball updated!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>Change Scroll-to-Top Pokéball</S.ModalTitle>
          <S.CloseButton onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </S.CloseButton>
        </S.ModalHeader>

        <S.ModalBody>
          <S.SearchContainer>
            <S.SearchInput
              type="text"
              placeholder="Search Pokéballs by name..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </S.SearchContainer>

          <S.ScrollableContent>
            {isLoading ? (
              <S.LoadingContainer>
                <S.LoadingSpinner />
                <S.LoadingText>Loading Pokéballs...</S.LoadingText>
              </S.LoadingContainer>
            ) : (
              <S.GridContainer>
                {displayPokeballs.map((ball) => (
                  <S.PokeballCard
                    key={ball.name}
                    selected={selectedPokeball === ball.name}
                    onClick={() => setSelectedPokeball(ball.name)}
                  >
                    <S.PokeballImage src={ball.sprite} alt={ball.name} />
                    <S.PokeballName>
                      {ball.name.replace(/-/g, " ")}
                    </S.PokeballName>
                  </S.PokeballCard>
                ))}
              </S.GridContainer>
            )}

            {!isLoading && displayPokeballs.length === 0 && (
              <S.EmptyState>
                <S.EmptyIcon>🔍</S.EmptyIcon>
                <S.EmptyText>No Pokéballs found</S.EmptyText>
              </S.EmptyState>
            )}
          </S.ScrollableContent>
        </S.ModalBody>

        <S.ModalFooter>
          <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          <S.SaveButton onClick={handleSave} disabled={!selectedPokeball}>
            Save Pokéball
          </S.SaveButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default PokeballChangeModal;
