import React, { useEffect, useMemo, useState } from "react";
import { Button, Loading, Text } from "@/components/ui";
import { useTcgCardDetail, useTcgCards } from "@/hooks/queries";
import { TcgAttack, TcgCardDetail } from "@/types/tcg.types";
import * as S from "./TcgTab.style";

interface TcgTabProps {
  pokemonName: string;
  enabled: boolean;
}

const PAGE_SIZE = 12;

const TcgTab: React.FC<TcgTabProps> = ({ pokemonName, enabled }) => {
  const [page, setPage] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const cardsQuery = useTcgCards(pokemonName, page, PAGE_SIZE, enabled);
  const detailQuery = useTcgCardDetail(selectedCardId, !!selectedCardId);

  useEffect(() => {
    setPage(1);
    setSelectedCardId(null);
  }, [pokemonName]);

  const totalPages = useMemo(() => {
    const totalCount = cardsQuery.data?.totalCount || 0;
    return Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  }, [cardsQuery.data?.totalCount]);

  const cards = cardsQuery.data?.data || [];
  const selectedCard: TcgCardDetail | undefined = detailQuery.data;

  const renderAttacks = (attacks?: TcgAttack[]) => {
    if (!attacks || attacks.length === 0) return <Text>-</Text>;
    return attacks.map((attack) => (
      <div key={attack.name}>
        <Text as="p">
          <strong>{attack.name}</strong> {attack.damage || ""}
        </Text>
        <Text as="p">{attack.text || "-"}</Text>
      </div>
    ));
  };

  if (cardsQuery.isLoading) {
    return <Loading label="Loading TCG cards..." />;
  }

  if (cardsQuery.isError) {
    return (
      <S.ErrorBox>
        <Text>Failed to load TCG cards for this Pokémon.</Text>
        <Button
          variant="light"
          onClick={() => cardsQuery.refetch()}
          style={{ width: "fit-content" }}
        >
          Retry
        </Button>
      </S.ErrorBox>
    );
  }

  return (
    <S.Section>
      <S.Header>
        <Text as="h3">TCG cards for {pokemonName.toUpperCase()}</Text>
        <Text as="p">Total: {cardsQuery.data?.totalCount || 0} cards</Text>
      </S.Header>

      {cards.length === 0 ? (
        <S.EmptyBox>No TCG card found for this Pokémon.</S.EmptyBox>
      ) : (
        <>
          <S.Grid>
            {cards.map((card) => (
              <S.CardItem key={card.id} onClick={() => setSelectedCardId(card.id)}>
                <S.CardImage
                  src={card.images?.small || card.images?.large || "/substitute.png"}
                  alt={card.name}
                  loading="lazy"
                />
                <S.CardMeta>
                  <S.Title>{card.name}</S.Title>
                  <S.MetaLine>
                    #{card.number} • {card.set.name}
                  </S.MetaLine>
                  <S.MetaLine>
                    {card.rarity || "Unknown rarity"}
                    {card.regulationMark ? ` • Mark ${card.regulationMark}` : ""}
                  </S.MetaLine>
                </S.CardMeta>
              </S.CardItem>
            ))}
          </S.Grid>

          <S.Paginator>
            <Button
              variant="light"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </Button>
            <Text>
              Page {page}/{totalPages}
            </Text>
            <Button
              variant="light"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </Button>
          </S.Paginator>
        </>
      )}

      {selectedCardId && (
        <S.ModalOverlay onClick={() => setSelectedCardId(null)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <div>
                <Text as="h3">{selectedCard?.name || "Loading card details..."}</Text>
                {selectedCard?.set && (
                  <Text as="p">
                    {selectedCard.set.series} • {selectedCard.set.name}
                  </Text>
                )}
              </div>
              <S.CloseButton onClick={() => setSelectedCardId(null)}>Close</S.CloseButton>
            </S.ModalHeader>

            {detailQuery.isLoading ? (
              <Loading label="Loading card detail..." />
            ) : detailQuery.isError || !selectedCard ? (
              <S.ErrorBox>
                <Text>Failed to load card detail.</Text>
                <Button variant="light" onClick={() => detailQuery.refetch()}>
                  Retry
                </Button>
              </S.ErrorBox>
            ) : (
              <S.DetailLayout>
                <S.DetailImage
                  src={
                    selectedCard.images?.large ||
                    selectedCard.images?.small ||
                    "/substitute.png"
                  }
                  alt={selectedCard.name}
                />

                <S.DetailBlock>
                  <div>
                    <S.Label>Card</S.Label> <S.Value>{selectedCard.id}</S.Value>
                  </div>
                  <div>
                    <S.Label>Supertype</S.Label>{" "}
                    <S.Value>{selectedCard.supertype || "-"}</S.Value>
                  </div>
                  <div>
                    <S.Label>Subtypes</S.Label>
                    <S.BadgeRow>
                      {(selectedCard.subtypes || []).map((subtype) => (
                        <S.Badge key={subtype}>{subtype}</S.Badge>
                      ))}
                    </S.BadgeRow>
                  </div>
                  <div>
                    <S.Label>HP / Types</S.Label>{" "}
                    <S.Value>
                      {selectedCard.hp || "-"} / {(selectedCard.types || []).join(", ") || "-"}
                    </S.Value>
                  </div>
                  <div>
                    <S.Label>Evolves From</S.Label>{" "}
                    <S.Value>{selectedCard.evolvesFrom || "-"}</S.Value>
                  </div>
                  <div>
                    <S.Label>Rarity / Regulation</S.Label>{" "}
                    <S.Value>
                      {selectedCard.rarity || "-"}
                      {selectedCard.regulationMark
                        ? ` / ${selectedCard.regulationMark}`
                        : ""}
                    </S.Value>
                  </div>
                  <div>
                    <S.Label>Weaknesses</S.Label>{" "}
                    <S.Value>
                      {(selectedCard.weaknesses || [])
                        .map((item) => `${item.type} ${item.value}`)
                        .join(", ") || "-"}
                    </S.Value>
                  </div>
                  <div>
                    <S.Label>Resistances</S.Label>{" "}
                    <S.Value>
                      {(selectedCard.resistances || [])
                        .map((item) => `${item.type} ${item.value}`)
                        .join(", ") || "-"}
                    </S.Value>
                  </div>
                  <div>
                    <S.Label>Retreat Cost</S.Label>{" "}
                    <S.Value>
                      {(selectedCard.retreatCost || []).join(", ") || "-"}
                      {typeof selectedCard.convertedRetreatCost === "number"
                        ? ` (${selectedCard.convertedRetreatCost})`
                        : ""}
                    </S.Value>
                  </div>
                  <div>
                    <S.Label>Artist</S.Label> <S.Value>{selectedCard.artist || "-"}</S.Value>
                  </div>
                  <div>
                    <S.Label>Legalities</S.Label>{" "}
                    <S.Value>
                      {selectedCard.legalities
                        ? Object.entries(selectedCard.legalities)
                            .map(([format, status]) => `${format}: ${status}`)
                            .join(" • ")
                        : "-"}
                    </S.Value>
                  </div>
                  <div>
                    <S.Label>Abilities</S.Label>
                    {(selectedCard.abilities || []).length === 0 ? (
                      <Text>-</Text>
                    ) : (
                      (selectedCard.abilities || []).map((ability) => (
                        <div key={ability.name}>
                          <Text as="p">
                            <strong>{ability.name}</strong> ({ability.type || "Ability"})
                          </Text>
                          <Text as="p">{ability.text || "-"}</Text>
                        </div>
                      ))
                    )}
                  </div>
                  <div>
                    <S.Label>Attacks</S.Label>
                    {renderAttacks(selectedCard.attacks)}
                  </div>
                  {selectedCard.flavorText && (
                    <div>
                      <S.Label>Flavor Text</S.Label>
                      <Text as="p">{selectedCard.flavorText}</Text>
                    </div>
                  )}
                </S.DetailBlock>
              </S.DetailLayout>
            )}
          </S.ModalContent>
        </S.ModalOverlay>
      )}
    </S.Section>
  );
};

export default TcgTab;
