import React, { useEffect, useMemo, useState } from "react";
import { Button, Loading, Text } from "@/components/ui";
import { useTcgCardDetail, useTcgCards, useTcgFacets } from "@/hooks/queries";
import { usePokemonTcgPreview } from "@/hooks/queries/usePokemonTcgPreview";
import {
  TcgAttack,
  TcgCardDetail,
  TcgCardFilters,
  TcgCardListItem,
} from "@/types/tcg.types";
import * as S from "./TcgTab.style";

interface TcgTabProps {
  pokemonName: string;
  pokemonApiId?: number;
  enabled: boolean;
}

const PAGE_SIZE = 12;

const TcgTab: React.FC<TcgTabProps> = ({
  pokemonName,
  pokemonApiId,
  enabled,
}) => {
  const [page, setPage] = useState(1);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [detailImageSrc, setDetailImageSrc] = useState("");
  const [filters, setFilters] = useState<TcgCardFilters>({
    rarity: "",
    regulationMark: "",
    subtype: "",
  });
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    ["--tiltX" as any]: "0deg",
    ["--tiltY" as any]: "0deg",
    ["--scale" as any]: 1,
  });

  const cardsQuery = useTcgCards(
    pokemonName,
    page,
    PAGE_SIZE,
    filters,
    enabled,
  );
  const facetsQuery = useTcgFacets(pokemonName, enabled);
  const detailQuery = useTcgCardDetail(selectedCardId, !!selectedCardId);
  const previewQuery = usePokemonTcgPreview(pokemonApiId, enabled);

  useEffect(() => {
    setPage(1);
    setSelectedCardId(null);
    setFilters({ rarity: "", regulationMark: "", subtype: "" });
  }, [pokemonName]);

  useEffect(() => {
    setPage(1);
  }, [filters.rarity, filters.regulationMark, filters.subtype]);

  const totalPages = useMemo(() => {
    const totalCount = cardsQuery.data?.totalCount || 0;
    return Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  }, [cardsQuery.data?.totalCount]);

  const cards = cardsQuery.data?.data || [];
  const rarityOptions = facetsQuery.data?.rarities || [];
  const subtypeOptions = facetsQuery.data?.subtypes || [];
  const regulationOptions = facetsQuery.data?.regulationMarks || [];

  const selectedCard: TcgCardDetail | undefined = detailQuery.data;
  const selectedCardSummary: TcgCardListItem | undefined = useMemo(
    () => cards.find((card) => card.id === selectedCardId),
    [cards, selectedCardId],
  );
  const displayCard = selectedCard || selectedCardSummary;

  useEffect(() => {
    const nextImage =
      displayCard?.images?.large ||
      displayCard?.images?.small ||
      "/substitute.png";
    setDetailImageSrc(nextImage);
  }, [displayCard]);

  useEffect(() => {
    if (selectedCardId) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [selectedCardId]);

  const renderAttacks = (attacks?: TcgAttack[]) => {
    if (!attacks || attacks.length === 0) return <S.DetailText>-</S.DetailText>;
    return attacks.map((attack) => (
      <S.AttackRow key={attack.name}>
        <S.AttackHeader>
          <S.AttackName>{attack.name}</S.AttackName>
          <S.AttackDamage>{attack.damage || "-"}</S.AttackDamage>
        </S.AttackHeader>
        <S.AttackDescription>{attack.text || "-"}</S.AttackDescription>
      </S.AttackRow>
    ));
  };

  if (cardsQuery.isLoading) {
    return <Loading label="Loading TCG cards..." />;
  }

  if (cardsQuery.isError) {
    return (
      <S.ErrorBox>
        <Text>Failed to load TCG cards for this Pokemon.</Text>
        <Text as="p">
          {(cardsQuery.error as Error)?.message || "Unknown error"}
        </Text>
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
        {previewQuery.data && previewQuery.data.length > 0 && (
          <Text as="p">
            Cached reward preview cards: {previewQuery.data.length}
          </Text>
        )}
      </S.Header>

      <S.FilterRow>
        <S.Select
          value={filters.rarity || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, rarity: e.target.value }))
          }
        >
          <option value="">All Rarity</option>
          {rarityOptions.map((rarity) => (
            <option key={rarity} value={rarity}>
              {rarity}
            </option>
          ))}
        </S.Select>

        <S.Select
          value={filters.regulationMark || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, regulationMark: e.target.value }))
          }
        >
          <option value="">All Regulation</option>
          {regulationOptions.map((mark) => (
            <option key={mark} value={mark}>
              {mark}
            </option>
          ))}
        </S.Select>

        <S.Select
          value={filters.subtype || ""}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, subtype: e.target.value }))
          }
        >
          <option value="">All Subtypes</option>
          {subtypeOptions.map((subtype) => (
            <option key={subtype} value={subtype}>
              {subtype}
            </option>
          ))}
        </S.Select>
      </S.FilterRow>

      {facetsQuery.isLoading && <Text as="p">Loading filters...</Text>}

      {cards.length === 0 ? (
        <S.EmptyBox>
          No TCG card found for this Pokemon with current filters.
        </S.EmptyBox>
      ) : (
        <>
          <S.Grid>
            {cards.map((card) => (
              <S.CardItem
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
              >
                <S.CardImage
                  src={
                    card.images?.small ||
                    card.images?.large ||
                    "/substitute.png"
                  }
                  alt={card.name}
                  loading="lazy"
                />
                <S.CardMeta>
                  <S.Title>{card.name}</S.Title>
                  <S.MetaLine>
                    #{card.number} - {card.set.name}
                  </S.MetaLine>
                  <S.MetaLine>
                    {card.rarity || "Unknown rarity"}
                    {card.regulationMark
                      ? ` - Mark ${card.regulationMark}`
                      : ""}
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
                <Text as="h3" variant="light">
                  {displayCard?.name || "Loading card details..."}
                </Text>
                {displayCard?.set && (
                  <Text as="p" variant="light">
                    {displayCard.set.series} - {displayCard.set.name}
                  </Text>
                )}
              </div>
              <S.CloseButton
                onClick={() => setSelectedCardId(null)}
                aria-label="Close modal"
                title="Close"
              >
                ×
              </S.CloseButton>
            </S.ModalHeader>

            {detailQuery.isLoading ? (
              <Loading label="Loading card detail..." />
            ) : detailQuery.isError || !displayCard ? (
              <S.ErrorBox>
                <Text>Failed to load card detail.</Text>
                <Text as="p">
                  {(detailQuery.error as Error)?.message || "Unknown error"}
                </Text>
                <Button variant="light" onClick={() => detailQuery.refetch()}>
                  Retry
                </Button>
              </S.ErrorBox>
            ) : (
              <S.DetailLayout>
                <S.CardStage>
                  <S.CardGlow />
                  <S.DetailImage
                    src={detailImageSrc}
                    alt={displayCard.name}
                    style={tiltStyle}
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const px = (e.clientX - rect.left) / rect.width;
                      const py = (e.clientY - rect.top) / rect.height;
                      const tiltY = (px - 0.5) * 10;
                      const tiltX = (0.5 - py) * 10;
                      setTiltStyle({
                        ["--tiltX" as any]: `${tiltX}deg`,
                        ["--tiltY" as any]: `${tiltY}deg`,
                        ["--scale" as any]: 1.03,
                      });
                    }}
                    onMouseLeave={() =>
                      setTiltStyle({
                        ["--tiltX" as any]: "0deg",
                        ["--tiltY" as any]: "0deg",
                        ["--scale" as any]: 1,
                      })
                    }
                    onError={() => {
                      if (
                        detailImageSrc !== displayCard.images?.small &&
                        displayCard.images?.small
                      ) {
                        setDetailImageSrc(displayCard.images.small);
                        return;
                      }
                      if (detailImageSrc !== "/substitute.png") {
                        setDetailImageSrc("/substitute.png");
                      }
                    }}
                  />
                </S.CardStage>

                <S.DetailBlock>
                  <S.ScrollArea>
                    <S.InfoChunk>
                      <S.PremiumTitle>{displayCard.name}</S.PremiumTitle>
                      <S.HeaderSub>
                        {displayCard.set.series} - {displayCard.set.name}
                      </S.HeaderSub>
                      <S.StatsRow>
                        <S.HpValue>{selectedCard?.hp || "-"} HP</S.HpValue>
                        <S.TypePill>
                          {(selectedCard?.types || [])[0] || "Unknown"}
                        </S.TypePill>
                      </S.StatsRow>
                      <S.BadgeRow>
                        <S.Badge>{displayCard.id}</S.Badge>
                        {displayCard.rarity && (
                          <S.Badge>{displayCard.rarity}</S.Badge>
                        )}
                      </S.BadgeRow>
                    </S.InfoChunk>

                    <S.InfoChunk>
                      <S.ChunkTitle>Basic Information</S.ChunkTitle>
                      <S.InfoGrid>
                        <S.DataRow>
                          <S.Label>Rarity</S.Label>
                          <S.Value>{displayCard.rarity || "-"}</S.Value>
                        </S.DataRow>
                        <S.DataRow>
                          <S.Label>Artist</S.Label>
                          <S.Value>{selectedCard?.artist || "-"}</S.Value>
                        </S.DataRow>
                        <S.DataRow>
                          <S.Label>Set</S.Label>
                          <S.Value>{displayCard.set.name}</S.Value>
                        </S.DataRow>
                        <S.DataRow>
                          <S.Label>Subtypes</S.Label>
                          <S.BadgeRow>
                            {(displayCard.subtypes || []).map((subtype) => (
                              <S.Badge key={subtype}>{subtype}</S.Badge>
                            ))}
                          </S.BadgeRow>
                        </S.DataRow>
                      </S.InfoGrid>
                    </S.InfoChunk>

                    <S.InfoChunk>
                      <S.ChunkTitle>Combat Stats</S.ChunkTitle>
                      <S.InfoGrid>
                        <S.DataRow>
                          <S.Label>Weakness</S.Label>
                          <S.Value>
                            {(selectedCard?.weaknesses || [])
                              .map((item) => `${item.type} ${item.value}`)
                              .join(", ") || "-"}
                          </S.Value>
                        </S.DataRow>
                        <S.DataRow>
                          <S.Label>Resistance</S.Label>
                          <S.Value>
                            {(selectedCard?.resistances || [])
                              .map((item) => `${item.type} ${item.value}`)
                              .join(", ") || "-"}
                          </S.Value>
                        </S.DataRow>
                        <S.DataRow>
                          <S.Label>Retreat</S.Label>
                          <S.Value>
                            {(selectedCard?.retreatCost || []).join(", ") ||
                              "-"}
                            {typeof selectedCard?.convertedRetreatCost ===
                            "number"
                              ? ` (${selectedCard.convertedRetreatCost})`
                              : ""}
                          </S.Value>
                        </S.DataRow>
                        <S.DataRow>
                          <S.Label>Evolves From</S.Label>
                          <S.Value>{selectedCard?.evolvesFrom || "-"}</S.Value>
                        </S.DataRow>
                      </S.InfoGrid>
                    </S.InfoChunk>

                    <S.InfoChunk>
                      <S.ChunkTitle>Tournament Legalities</S.ChunkTitle>
                      <S.BadgeRow>
                        {selectedCard?.legalities
                          ? Object.entries(selectedCard.legalities).map(
                              ([format, status]) => (
                                <S.LegalBadge key={format}>
                                  {format}: {status}
                                </S.LegalBadge>
                              ),
                            )
                          : "-"}
                      </S.BadgeRow>
                    </S.InfoChunk>

                    <S.AbilityChunk>
                      <S.ChunkTitle>Abilities</S.ChunkTitle>
                      {(selectedCard?.abilities || []).length === 0 ? (
                        <S.DetailText>-</S.DetailText>
                      ) : (
                        (selectedCard?.abilities || []).map((ability) => (
                          <S.AttackRow key={ability.name}>
                            <S.AttackHeader>
                              <S.AttackName>{ability.name}</S.AttackName>
                              <S.AbilityTypeBadge>
                                {ability.type || "Ability"}
                              </S.AbilityTypeBadge>
                            </S.AttackHeader>
                            <S.AttackDescription>
                              {ability.text || "-"}
                            </S.AttackDescription>
                          </S.AttackRow>
                        ))
                      )}
                    </S.AbilityChunk>

                    <S.InfoChunk>
                      <S.ChunkTitle>Attacks</S.ChunkTitle>
                      {renderAttacks(selectedCard?.attacks)}
                    </S.InfoChunk>

                    {selectedCard?.flavorText && (
                      <S.InfoChunk>
                        <S.ChunkTitle>Flavor Text</S.ChunkTitle>
                        <S.DetailText>{selectedCard.flavorText}</S.DetailText>
                      </S.InfoChunk>
                    )}
                  </S.ScrollArea>
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
