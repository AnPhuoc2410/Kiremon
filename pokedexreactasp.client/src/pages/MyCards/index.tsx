import { createRef, useMemo, useState } from "react";

import { Button, Header, Loading, Navbar, Text } from "@/components/ui";
import { useMyTcgCards } from "@/hooks/queries";
import { MyTcgCardsQuery, TcgSort } from "@/types/tcg-card-collection.types";

import * as S from "./index.style";

const DEFAULT_PAGE_SIZE = 30;

const MyCards = () => {
  const navRef = createRef<HTMLDivElement>();

  const [page, setPage] = useState(1);
  const [pokemonApiIdInput, setPokemonApiIdInput] = useState("");
  const [rarityTier, setRarityTier] = useState("");
  const [sort, setSort] = useState<TcgSort>("obtained-desc");

  const query: MyTcgCardsQuery = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      pokemonApiId: pokemonApiIdInput ? Number(pokemonApiIdInput) : undefined,
      rarityTier: rarityTier || undefined,
      sort,
    }),
    [page, pokemonApiIdInput, rarityTier, sort],
  );

  const myCardsQuery = useMyTcgCards(query, true);
  const cards = myCardsQuery.data?.items ?? [];
  const totalCount = myCardsQuery.data?.totalCount ?? 0;
  const pageSize = myCardsQuery.data?.pageSize ?? DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      <S.Page style={{ marginBottom: navRef.current?.clientHeight ?? 120 }}>
        <Header title="My Cards" subtitle="Your TCG reward collection" />

        <S.Controls>
          <S.Input
            type="number"
            min={1}
            placeholder="Pokemon API ID"
            value={pokemonApiIdInput}
            onChange={(e) => {
              setPage(1);
              setPokemonApiIdInput(e.target.value);
            }}
          />

          <S.Select
            value={rarityTier}
            onChange={(e) => {
              setPage(1);
              setRarityTier(e.target.value);
            }}
          >
            <option value="">All Rarity Tiers</option>
            <option value="Common">Common</option>
            <option value="Uncommon">Uncommon</option>
            <option value="Rare">Rare</option>
            <option value="HoloRare">Holo Rare</option>
            <option value="UltraRare">Ultra Rare</option>
            <option value="SecretRare">Secret Rare</option>
            <option value="Promo">Promo</option>
            <option value="Unknown">Unknown</option>
          </S.Select>

          <S.Select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value as TcgSort);
            }}
          >
            <option value="obtained-desc">Newest obtained</option>
            <option value="obtained-asc">Oldest obtained</option>
            <option value="rarity-desc">Rarity high to low</option>
            <option value="rarity-asc">Rarity low to high</option>
          </S.Select>

          <Button
            variant="light"
            onClick={() => {
              setPage(1);
              setPokemonApiIdInput("");
              setRarityTier("");
              setSort("obtained-desc");
            }}
          >
            Reset filters
          </Button>
        </S.Controls>

        {myCardsQuery.isLoading ? (
          <Loading label="Loading your cards..." />
        ) : myCardsQuery.isError ? (
          <Text>Failed to load your card collection.</Text>
        ) : cards.length === 0 ? (
          <Text>No cards found for current filters.</Text>
        ) : (
          <>
            <Text style={{ marginBottom: 12 }}>Total cards: {totalCount}</Text>
            <S.Grid>
              {cards.map((card) => (
                <S.Card key={card.userCardId}>
                  <img
                    src={card.imageLarge || card.imageSmall || "/substitute.png"}
                    alt={card.name}
                    loading="lazy"
                  />
                  <S.CardBody>
                    <Text as="h3">{card.name}</Text>
                    <Text>ID: {card.tcgCardId}</Text>
                    <Text>
                      {card.rarity || "Unknown"} · {card.rarityTier}
                    </Text>
                    <Text>Qty: {card.quantity}</Text>
                  </S.CardBody>
                </S.Card>
              ))}
            </S.Grid>
          </>
        )}

        <S.Pager>
          <Button
            variant="light"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          >
            Prev
          </Button>
          <Text>
            Page {page} / {totalPages}
          </Text>
          <Button
            variant="light"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
          >
            Next
          </Button>
        </S.Pager>
      </S.Page>

      <Navbar ref={navRef} />
    </>
  );
};

export default MyCards;
