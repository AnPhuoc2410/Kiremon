import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import InfiniteScroll from "react-infinite-scroll-component";
import { POKEMON_API } from "../../../config/api.config";
import * as S from "./index.style";

interface Pokemon {
  id: number;
  name: string;
  sprite: string;
}

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAvatar: (avatarUrl: string) => void;
  currentAvatar?: string | null;
}

const AvatarChangeModal: React.FC<AvatarChangeModalProps> = ({
  isOpen,
  onClose,
  onSelectAvatar,
  currentAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<"system" | "upload" | "url">(
    "system",
  );
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    currentAvatar || null,
  );
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedPokemon, setSearchedPokemon] = useState<Pokemon | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Search pokemon by ID or name
  const searchPokemon = async (query: string) => {
    if (!query.trim()) {
      setSearchedPokemon(null);
      return;
    }

    try {
      setIsSearching(true);
      const response = await fetch(`${POKEMON_API}/${query.toLowerCase()}`);

      if (!response.ok) {
        setSearchedPokemon(null);
        return;
      }

      const data = await response.json();
      const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        sprite:
          data.sprites.front_default ||
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
      };

      setSearchedPokemon(pokemon);
    } catch (error) {
      console.error("Failed to search Pokemon:", error);
      setSearchedPokemon(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchPokemon(searchQuery);
      } else {
        setSearchedPokemon(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filtered pokemons based on search
  const displayPokemons = searchedPokemon
    ? [searchedPokemon]
    : pokemons.filter((pokemon) => {
        const query = searchQuery.toLowerCase();
        return (
          pokemon.name.toLowerCase().includes(query) ||
          pokemon.id.toString().includes(query)
        );
      });

  // Load more pokemons
  const loadPokemons = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = await fetch(`${POKEMON_API}?limit=20&offset=${offset}`);
      const data = await response.json();

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: { name: string; url: string }) => {
          const id = parseInt(
            pokemon.url.split("/").filter(Boolean).pop() || "0",
          );
          return {
            id,
            name: pokemon.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
          };
        }),
      );

      setPokemons((prev) => [...prev, ...pokemonDetails]);
      setOffset((prev) => prev + 20);
      setHasMore(!!data.next);
    } catch (error) {
      console.error("Failed to load Pokemon:", error);
      toast.error("Failed to load Pokemon avatars");
    } finally {
      setIsLoading(false);
    }
  }, [offset, isLoading]);

  // Load initial pokemons when modal opens
  useEffect(() => {
    if (isOpen && pokemons.length === 0) {
      loadPokemons();
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSelectedAvatar(currentAvatar || null);
      setImageUrl("");
      setUploadedImage(null);
    }
  }, [isOpen, currentAvatar]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        setSelectedAvatar(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlSubmit = () => {
    if (!imageUrl) {
      toast.error("Please enter an image URL");
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl);
      setSelectedAvatar(imageUrl);
      toast.success("Image URL set!");
    } catch {
      toast.error("Invalid URL format");
    }
  };

  const handleSave = () => {
    if (!selectedAvatar) {
      toast.error("Please select an avatar");
      return;
    }

    onSelectAvatar(selectedAvatar);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContainer onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <S.ModalHeader>
          <S.ModalTitle>Change Avatar</S.ModalTitle>
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

        <S.TabContainer>
          <S.Tab
            active={activeTab === "system"}
            onClick={() => setActiveTab("system")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="M2 12h7a3 3 0 0 0 6 0h7"
                stroke="currentColor"
                strokeWidth="2"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            Pokémon
          </S.Tab>
          <S.Tab
            active={activeTab === "upload"}
            onClick={() => setActiveTab("upload")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload
          </S.Tab>
          <S.Tab
            active={activeTab === "url"}
            onClick={() => setActiveTab("url")}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            URL
          </S.Tab>
        </S.TabContainer>

        <S.ModalBody>
          {activeTab === "system" && (
            <>
              <S.SearchContainer>
                <S.SearchInput
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchQuery(e.target.value)
                  }
                />
                {isSearching && <S.SearchSpinner />}
              </S.SearchContainer>

              <S.ScrollableContent id="pokemon-scroll-container">
                {pokemons.length === 0 && isLoading ? (
                  // Initial loading state
                  <S.GridContainer>
                    {Array(12)
                      .fill(0)
                      .map((_, index) => (
                        <S.AvatarSkeleton key={`initial-skeleton-${index}`}>
                          <S.SkeletonImage />
                          <S.SkeletonName />
                          <S.SkeletonId />
                        </S.AvatarSkeleton>
                      ))}
                  </S.GridContainer>
                ) : (
                  <InfiniteScroll
                    dataLength={displayPokemons.length}
                    next={loadPokemons}
                    hasMore={hasMore && !searchQuery}
                    loader={
                      <S.GridContainer>
                        {Array(8)
                          .fill(0)
                          .map((_, index) => (
                            <S.AvatarSkeleton key={`skeleton-${index}`}>
                              <S.SkeletonImage />
                              <S.SkeletonName />
                              <S.SkeletonId />
                            </S.AvatarSkeleton>
                          ))}
                      </S.GridContainer>
                    }
                    scrollableTarget="pokemon-scroll-container"
                  >
                    <S.GridContainer>
                      {displayPokemons.map((pokemon) => (
                        <S.AvatarCard
                          key={pokemon.id}
                          selected={selectedAvatar === pokemon.sprite}
                          onClick={() => setSelectedAvatar(pokemon.sprite)}
                        >
                          <S.AvatarImage
                            src={pokemon.sprite}
                            alt={pokemon.name}
                          />
                          <S.AvatarName>{pokemon.name}</S.AvatarName>
                          <S.AvatarId>
                            #{pokemon.id.toString().padStart(3, "0")}
                          </S.AvatarId>
                        </S.AvatarCard>
                      ))}
                    </S.GridContainer>
                  </InfiniteScroll>
                )}

                {searchQuery &&
                  displayPokemons.length === 0 &&
                  !isLoading &&
                  !isSearching && (
                    <S.EmptyState>
                      <S.EmptyIcon>🔍</S.EmptyIcon>
                      <S.EmptyText>No Pokémon found</S.EmptyText>
                    </S.EmptyState>
                  )}
              </S.ScrollableContent>
            </>
          )}

          {activeTab === "upload" && (
            <S.UploadContainer>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />

              {uploadedImage ? (
                <S.PreviewContainer>
                  <S.PreviewImage src={uploadedImage} alt="Uploaded avatar" />
                  <S.ChangeButton onClick={() => fileInputRef.current?.click()}>
                    Change Image
                  </S.ChangeButton>
                </S.PreviewContainer>
              ) : (
                <S.UploadBox onClick={() => fileInputRef.current?.click()}>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <S.UploadText>Click to upload an image</S.UploadText>
                  <S.UploadHint>PNG, JPG, GIF up to 5MB</S.UploadHint>
                </S.UploadBox>
              )}
            </S.UploadContainer>
          )}

          {activeTab === "url" && (
            <S.UrlContainer>
              <S.UrlInputGroup>
                <S.UrlInput
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={imageUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setImageUrl(e.target.value)
                  }
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && handleUrlSubmit()
                  }
                />
                <S.UrlButton onClick={handleUrlSubmit}>Set Image</S.UrlButton>
              </S.UrlInputGroup>

              {selectedAvatar && activeTab === "url" && (
                <S.PreviewContainer>
                  <S.PreviewImage
                    src={selectedAvatar}
                    alt="Preview"
                    onError={() => {
                      toast.error("Failed to load image from URL");
                      setSelectedAvatar(null);
                    }}
                  />
                </S.PreviewContainer>
              )}
            </S.UrlContainer>
          )}
        </S.ModalBody>

        <S.ModalFooter>
          <S.CancelButton onClick={onClose}>Cancel</S.CancelButton>
          <S.SaveButton onClick={handleSave} disabled={!selectedAvatar}>
            Save Avatar
          </S.SaveButton>
        </S.ModalFooter>
      </S.ModalContainer>
    </S.ModalOverlay>
  );
};

export default AvatarChangeModal;
