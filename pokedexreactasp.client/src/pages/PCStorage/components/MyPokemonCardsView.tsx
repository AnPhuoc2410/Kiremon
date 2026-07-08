import React, { useMemo } from "react";
import { useMyTcgCards } from "@/hooks/queries";
import { Loading, Text, Modal } from "@/components/ui";
import { IconPhoto, IconX } from "@tabler/icons-react";
import { getTcgCardRarityTierDisplay } from "@/types/pokemon.enums";

export const MyPokemonCardsView: React.FC<{
  pokemonApiId?: number;
  pokemonName?: string;
  isOpen: boolean;
  onClose: () => void;
}> = ({ pokemonApiId, pokemonName, isOpen, onClose }) => {
  const query = useMemo(
    () => ({
      page: 1,
      pageSize: 50,
      pokemonApiId: pokemonApiId,
      sort: "obtained-desc" as const,
    }),
    [pokemonApiId],
  );

  const myCardsQuery = useMyTcgCards(query, !!pokemonApiId && isOpen);

  return (
    <Modal open={isOpen} overlay="dark-translucent">
      <div
        style={{
          width: "90vw",
          maxWidth: "900px",
          background: "#fdfdfd",
          border: "3px solid #0f172a",
          borderRadius: "0px",
          overflow: "hidden",
          boxShadow: "6px 6px 0px #0f172a",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "3px solid #0f172a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#ffffff",
          }}
        >
          <div>
            <Text
              as="h2"
              size="xl"
              style={{
                color: "#0f172a",
                margin: 0,
                fontWeight: 700,
                fontSize: "1.4rem",
              }}
            >
              {pokemonName ? `${pokemonName} Collection` : "Card Collection"}
            </Text>
            <Text
              size="sm"
              style={{
                color: "#475569",
                marginTop: "4px",
                fontSize: "0.95rem",
              }}
            >
              Dex No. {String(pokemonApiId).padStart(3, "0")}
            </Text>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#ffffff",
              border: "2px solid #0f172a",
              borderRadius: "2px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0f172a",
              cursor: "pointer",
              boxShadow: "2px 2px 0px #0f172a",
              transition: "all 0.1s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#ef4444";
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#ffffff";
              e.currentTarget.style.color = "#0f172a";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <IconX size={20} stroke={2.5} />
          </button>
        </div>

        <div
          style={{
            padding: "32px",
            minHeight: "400px",
            maxHeight: "65vh",
            overflowY: "auto",
          }}
        >
          {myCardsQuery.isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Loading label="Fetching cards..." />
            </div>
          ) : myCardsQuery.isError ? (
            <div
              style={{ textAlign: "center", color: "#ef4444", fontWeight: 600 }}
            >
              Failed to load card collection.
            </div>
          ) : myCardsQuery.data?.items?.length ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: "24px",
              }}
            >
              {myCardsQuery.data.items.map((card) => (
                <div
                  key={card.userCardId}
                  style={{
                    background: "#ffffff",
                    border: "2px solid #0f172a",
                    borderRadius: "4px",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    boxShadow: "3px 3px 0px rgba(15,23,42,0.15)",
                    transition: "all 0.15s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "3px 5px 0px #0f172a";
                    e.currentTarget.style.background = "#eff6ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "3px 3px 0px rgba(15,23,42,0.15)";
                    e.currentTarget.style.background = "#ffffff";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingBottom: "139%",
                      background: "#f8fafc",
                      borderRadius: "2px",
                      overflow: "hidden",
                      border: "1px solid #cbd5e1",
                    }}
                  >
                    <img
                      src={
                        card.imageLarge ||
                        card.imageSmall ||
                        "/static/tcgcard_back.png"
                      }
                      alt={card.name}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <Text
                      style={{
                        fontWeight: "700",
                        fontSize: "1rem",
                        color: "#0f172a",
                        marginBottom: "8px",
                        lineHeight: "1.4",
                      }}
                    >
                      {card.name}
                    </Text>
                    <div
                      style={{
                        display: "flex",
                        justifyItems: "center",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: "0.85rem",
                          color: "#34383dff",
                          fontWeight: 500,
                        }}
                      >
                        {getTcgCardRarityTierDisplay(card.rarityTier)}
                      </Text>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "#f1f5f9",
                          border: "1px solid #cbd5e1",
                          borderRadius: "4px",
                          padding: "4px 8px",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "600",
                            color: "#334155",
                          }}
                        >
                          Qty: {card.quantity}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "300px",
                color: "#475569",
              }}
            >
              <IconPhoto
                size={48}
                stroke={1.5}
                style={{ marginBottom: "16px", color: "#94a3b8" }}
              />
              <Text size="lg" style={{ color: "#0f172a", fontWeight: 600 }}>
                No cards collected yet
              </Text>
              <Text size="sm" style={{ marginTop: "8px" }}>
                This Pokémon is not yet in your TCG Binder.
              </Text>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
