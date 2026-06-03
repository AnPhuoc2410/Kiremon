import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { IconSearch } from "@tabler/icons-react";
import { Header, Loading } from "@/components/ui";
import { useDebounce } from "@/components/hooks";
import { useLanguage } from "@/contexts";
import { useTcgCardDetail, useTcgCards, useTcgFacets } from "@/hooks/queries";
import { TcgCardFilters, TcgCardListItem } from "@/types/tcg.types";
import { t } from "@/utils/uiI18n";
import * as S from "./index.style";

const PAGE_SIZE = 12;
const DEFAULT_POKEMON = "pikachu";

const PokeTcg: React.FC = () => {
  const pageRef = useRef<HTMLElement | null>(null);
  const [draftSearch, setDraftSearch] = useState(DEFAULT_POKEMON);
  const [pokemonName, setPokemonName] = useState(DEFAULT_POKEMON);
  const [page, setPage] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TcgCardFilters>({
    rarity: "",
    regulationMark: "",
    subtype: "",
  });
  const { languageId } = useLanguage();

  const debouncedPokemonName = useDebounce(pokemonName.trim(), 300);
  const cardsQuery = useTcgCards(
    debouncedPokemonName,
    page,
    PAGE_SIZE,
    filters,
    !!debouncedPokemonName,
  );
  const facetsQuery = useTcgFacets(
    debouncedPokemonName,
    !!debouncedPokemonName,
  );
  const detailQuery = useTcgCardDetail(selectedCardId, !!selectedCardId);

  const cards = cardsQuery.data?.data || [];
  const selectedSummary = useMemo(
    () => cards.find((card) => card.id === selectedCardId),
    [cards, selectedCardId],
  );
  const detailCard = detailQuery.data;
  const selectedCard = detailCard || selectedSummary;
  const totalCount = cardsQuery.data?.totalCount || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const rarityOptions = facetsQuery.data?.rarities || [];
  const regulationOptions = facetsQuery.data?.regulationMarks || [];
  const subtypeOptions = facetsQuery.data?.subtypes || [];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tcg-reveal",
        { y: 14, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.42,
          ease: "power2.out",
          stagger: 0.06,
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!cards.length || !pageRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tcg-card",
        { y: 10, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.28,
          ease: "power1.out",
          stagger: 0.025,
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, [
    cards.length,
    page,
    debouncedPokemonName,
    filters.rarity,
    filters.regulationMark,
    filters.subtype,
  ]);

  useEffect(() => {
    setPage(1);
    setSelectedCardId(null);
    setFilters({ rarity: "", regulationMark: "", subtype: "" });
  }, [debouncedPokemonName]);

  useEffect(() => {
    setPage(1);
  }, [filters.rarity, filters.regulationMark, filters.subtype]);

  useEffect(() => {
    if (!selectedCardId) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedCardId]);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = draftSearch.trim().toLowerCase();
    if (!nextName) return;
    setPokemonName(nextName);
  };

  const renderCard = (card: TcgCardListItem) => (
    <S.CardButton
      key={card.id}
      type="button"
      className="tcg-card"
      onClick={() => setSelectedCardId(card.id)}
    >
      <S.CardImageWrap>
        <S.CardImage
          src={card.images?.small || card.images?.large || "/substitute.png"}
          alt={card.name}
          loading="lazy"
        />
      </S.CardImageWrap>
      <S.CardMeta>
        <S.CardName>{card.name}</S.CardName>
        <S.CardSmall>
          {card.set.name} #{card.number}
        </S.CardSmall>
        <S.RarityBadge>{card.rarity || "Unknown rarity"}</S.RarityBadge>
      </S.CardMeta>
    </S.CardButton>
  );

  return (
    <S.Page ref={pageRef}>
      <Header
        title={t("tcg.title", languageId)}
        subtitle={t("tcg.subtitle", languageId)}
      />

      <S.IntroPanel className="tcg-reveal">
        <S.IntroCopy>
          <S.PixelLabel>Trading Card Gallery</S.PixelLabel>
          <S.IntroTitle>Search cards by Pokemon name</S.IntroTitle>
          <S.IntroText>
            Browse TCG cards with the same trainer-friendly visual language as
            the rest of the Pokedex: clean panels, pixel accents, and readable
            item-style controls.
          </S.IntroText>

          <S.SearchForm onSubmit={submitSearch}>
            <S.SearchInput
              value={draftSearch}
              onChange={(event) => setDraftSearch(event.target.value)}
              placeholder="pikachu, charizard, mew..."
              aria-label="Search Pokemon TCG by Pokemon name"
            />
            <S.SearchButton type="submit">
              <IconSearch size={18} stroke={2.5} />
              Search
            </S.SearchButton>
          </S.SearchForm>
        </S.IntroCopy>

        <S.PreviewStack aria-hidden="true">
          <S.PreviewCard
            src="https://images.pokemontcg.io/base1/4_hires.png"
            alt=""
          />
          <S.PreviewSprite
            src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png"
            alt=""
          />
        </S.PreviewStack>
      </S.IntroPanel>

      <S.Toolbar className="tcg-reveal">
        <S.Stat>
          <span>Pokemon</span>
          <strong>{debouncedPokemonName || DEFAULT_POKEMON}</strong>
        </S.Stat>
        <S.Stat>
          <span>Total</span>
          <strong>{cardsQuery.isLoading ? "--" : totalCount}</strong>
        </S.Stat>
        <S.Select
          value={filters.rarity || ""}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, rarity: event.target.value }))
          }
          aria-label="Filter by rarity"
        >
          <option value="">All rarity</option>
          {rarityOptions.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </S.Select>
        <S.Select
          value={filters.regulationMark || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              regulationMark: event.target.value,
            }))
          }
          aria-label="Filter by regulation mark"
        >
          <option value="">All regulation</option>
          {regulationOptions.map((mark) => (
            <option key={mark} value={mark}>
              Mark {mark}
            </option>
          ))}
        </S.Select>
        <S.Select
          value={filters.subtype || ""}
          onChange={(event) =>
            setFilters((prev) => ({ ...prev, subtype: event.target.value }))
          }
          aria-label="Filter by subtype"
        >
          <option value="">All subtypes</option>
          {subtypeOptions.map((subtype) => (
            <option key={subtype} value={subtype}>
              {subtype}
            </option>
          ))}
        </S.Select>
      </S.Toolbar>

      {facetsQuery.isLoading && <S.HelperText>Loading filters...</S.HelperText>}

      {cardsQuery.isLoading ? (
        <S.StatePanel>
          <Loading label="Loading Poke TCG cards..." />
        </S.StatePanel>
      ) : cardsQuery.isError ? (
        <S.StatePanel>
          Failed to load Poke TCG cards.{" "}
          {(cardsQuery.error as Error)?.message || "Please try again."}
        </S.StatePanel>
      ) : cards.length === 0 ? (
        <S.StatePanel>
          No cards found for this Pokemon and filter set.
        </S.StatePanel>
      ) : (
        <>
          <S.CardGrid>{cards.map(renderCard)}</S.CardGrid>
          <S.Pager>
            <S.PagerButton
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </S.PagerButton>
            <S.PageCount>
              Page {page}/{totalPages}
            </S.PageCount>
            <S.PagerButton
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </S.PagerButton>
          </S.Pager>
        </>
      )}

      {selectedCardId && selectedCard && (
        <S.ModalOverlay onClick={() => setSelectedCardId(null)}>
          <S.ModalContent onClick={(event) => event.stopPropagation()}>
            <S.ModalImage
              src={
                selectedCard.images?.large ||
                selectedCard.images?.small ||
                "/substitute.png"
              }
              alt={selectedCard.name}
            />
            <S.ModalInfo>
              <S.ModalHeader>
                <div>
                  <S.ModalTitle>{selectedCard.name}</S.ModalTitle>
                  <S.HelperText>
                    {selectedCard.set.series} - {selectedCard.set.name}
                  </S.HelperText>
                </div>
                <S.CloseButton
                  type="button"
                  onClick={() => setSelectedCardId(null)}
                  aria-label="Close card detail"
                >
                  x
                </S.CloseButton>
              </S.ModalHeader>

              {detailQuery.isLoading ? (
                <Loading label="Loading card detail..." />
              ) : (
                <>
                  <S.DetailGrid>
                    <S.DetailCell>
                      <span>HP</span>
                      <strong>{detailCard?.hp || "-"}</strong>
                    </S.DetailCell>
                    <S.DetailCell>
                      <span>Type</span>
                      <strong>{detailCard?.types?.join(", ") || "-"}</strong>
                    </S.DetailCell>
                    <S.DetailCell>
                      <span>Rarity</span>
                      <strong>{selectedCard.rarity || "-"}</strong>
                    </S.DetailCell>
                    <S.DetailCell>
                      <span>Artist</span>
                      <strong>{detailCard?.artist || "-"}</strong>
                    </S.DetailCell>
                  </S.DetailGrid>

                  <S.DetailCell>
                    <span>Attacks</span>
                    {detailCard?.attacks && detailCard.attacks.length > 0 ? (
                      detailCard.attacks.map((attack) => (
                        <p key={attack.name}>
                          <strong>
                            {attack.name} {attack.damage || ""}
                          </strong>
                          {attack.text || "-"}
                        </p>
                      ))
                    ) : (
                      <p>-</p>
                    )}
                  </S.DetailCell>

                  {detailCard?.flavorText && (
                    <S.DetailCell>
                      <span>Flavor</span>
                      <p>{detailCard.flavorText}</p>
                    </S.DetailCell>
                  )}
                </>
              )}
            </S.ModalInfo>
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Page>
  );
};

export default PokeTcg;
