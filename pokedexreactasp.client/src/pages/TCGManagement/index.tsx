import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import gsap from "gsap";
import {
  IconSearch,
  IconCards,
  IconSword,
  IconCoin,
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconRefresh,
  IconPackage,
  IconTrophy,
  IconDatabase,
} from "@tabler/icons-react";

import { Navbar, Loading, StorageHeader } from "@/components/ui";
import { useMyTcgCards } from "@/hooks/queries";
import {
  MyTcgCardsQuery,
  TcgSort,
  MyTcgCardItem,
} from "@/types/tcg-card-collection.types";

import * as S from "./index.style";
import { InteractiveCard } from "./components/InteractiveCard";
import { ExpandedCardOverlay } from "./components/ExpandedCardOverlay";

import { ActiveTab } from "./types";
import { PAGE_SIZE, RARITY_OPTIONS, SORT_OPTIONS } from "./constants";

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
const TCGManagement: React.FC = () => {
  // ── Filter / sort state ───────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rarityTier, setRarityTier] = useState("");
  const [sort, setSort] = useState<TcgSort>("obtained-desc");
  const [activeTab, setActiveTab] = useState<ActiveTab>("collection");

  // ── Detail panel state ────────────────────────────────────────────────────
  const [selectedCard, setSelectedCard] = useState<MyTcgCardItem | null>(null);

  // ── Refs for GSAP ─────────────────────────────────────────────────────────
  const gridRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef(page);

  // ── Debounce search ───────────────────────────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 320);
    return () => clearTimeout(id);
  }, [search]);

  // ── Query ─────────────────────────────────────────────────────────────────
  const query: MyTcgCardsQuery = useMemo(
    () => ({
      page,
      pageSize: PAGE_SIZE,
      pokemonApiId: undefined, // global view — all Pokémon
      rarityTier: rarityTier || undefined,
      sort,
    }),
    [page, rarityTier, sort],
  );

  const { data, isLoading, isError, isFetching } = useMyTcgCards(
    query,
    activeTab === "collection",
  );

  const cards = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / (data?.pageSize ?? PAGE_SIZE)),
  );

  // ── Client-side search filter (applied on top of server data) ─────────────
  const filteredCards = useMemo(() => {
    if (!debouncedSearch.trim()) return cards;
    const q = debouncedSearch.toLowerCase().trim();
    return cards.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.rarityTier.toLowerCase().includes(q) ||
        c.tcgCardId.toLowerCase().includes(q),
    );
  }, [cards, debouncedSearch]);

  // ── Stats (derived) ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const unique = new Set(cards.map((c) => c.pokemonApiId)).size;
    const totalQty = cards.reduce((acc, c) => acc + c.quantity, 0);
    const rareCount = cards.filter((c) =>
      ["UltraRare", "SecretRare", "HoloRare"].includes(c.rarityTier),
    ).length;
    return { totalCount, unique, totalQty, rareCount };
  }, [cards, totalCount]);

  // ── GSAP: animate card grid on page change ────────────────────────────────
  useEffect(() => {
    if (!gridRef.current) return;
    const cells = gridRef.current.querySelectorAll("[data-card-item]");
    if (!cells.length) return;

    const dir = page > prevPageRef.current ? 1 : -1;
    prevPageRef.current = page;

    gsap.fromTo(
      cells,
      { opacity: 0, x: 40 * dir, y: 16 },
      {
        opacity: 1,
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: { amount: 0.25, from: "start" },
      },
    );
  }, [filteredCards, page]);

  // ── GSAP: animate on tab change ───────────────────────────────────────────
  useEffect(() => {
    if (!gridRef.current) return;
    gsap.fromTo(
      gridRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
    );
  }, [activeTab]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
    setRarityTier("");
    setSort("obtained-desc");
  }, []);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setSelectedCard(null);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />

      <S.Page>
        <StorageHeader />

        <S.StatsBar>
          <S.StatCard accent="#0ea5e9">
            <span className="stat-label">Total Cards</span>
            <span className="stat-value">{totalCount.toLocaleString()}</span>
            <span className="stat-sub">in your binder</span>
          </S.StatCard>
          <S.StatCard accent="#22c55e">
            <span className="stat-label">Unique Pokémon</span>
            <span className="stat-value">{stats.unique}</span>
            <span className="stat-sub">on this page</span>
          </S.StatCard>
          <S.StatCard accent="#f97316">
            <span className="stat-label">Rare+ Cards</span>
            <span className="stat-value">{stats.rareCount}</span>
            <span className="stat-sub">holo / ultra / secret</span>
          </S.StatCard>
          <S.StatCard accent="#7c3aed">
            <span className="stat-label">Market Value</span>
            <span className="stat-value">—</span>
            <span className="stat-sub">coming soon</span>
          </S.StatCard>
        </S.StatsBar>

        {/* ── Tab navigation ── */}
        <S.TabNav>
          <S.Tab
            active={activeTab === "collection"}
            onClick={() => handleTabChange("collection")}
          >
            <IconCards size={14} stroke={2} />
            Collection
          </S.Tab>
          <S.Tab
            active={activeTab === "deck"}
            onClick={() => handleTabChange("deck")}
          >
            <IconSword size={14} stroke={2} />
            Build Deck
          </S.Tab>
          <S.Tab
            active={activeTab === "market"}
            onClick={() => handleTabChange("market")}
          >
            <IconCoin size={14} stroke={2} />
            Market Value
          </S.Tab>
        </S.TabNav>

        {/* ── Tab content ── */}
        <div ref={gridRef}>
          {activeTab === "collection" && (
            <>
              {/* Controls */}
              <S.ControlsBar>
                <S.SearchBox>
                  <IconSearch size={18} stroke={2} />
                  <input
                    id="tcg-search"
                    type="text"
                    placeholder="Search card name, ID, rarity..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    autoComplete="off"
                  />
                  {search && (
                    <button
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                      }}
                      onClick={() => {
                        setSearch("");
                        setDebouncedSearch("");
                      }}
                      aria-label="Clear search"
                    >
                      <IconX
                        size={16}
                        stroke={2}
                        style={{ color: "#64748b" }}
                      />
                    </button>
                  )}
                </S.SearchBox>

                <S.FilterSelect
                  value={rarityTier}
                  onChange={(e) => {
                    setPage(1);
                    setRarityTier(e.target.value);
                  }}
                  aria-label="Filter by rarity"
                >
                  {RARITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </S.FilterSelect>

                <S.FilterSelect
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value as TcgSort);
                  }}
                  aria-label="Sort cards"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </S.FilterSelect>

                <S.PixelBtn
                  variant="ghost"
                  onClick={handleReset}
                  title="Reset filters"
                >
                  <IconRefresh size={16} stroke={2} />
                  Reset
                </S.PixelBtn>
              </S.ControlsBar>

              {/* Card grid */}
              {isLoading ? (
                <S.CardGrid style={{ marginTop: 16 }}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <S.SkeletonCard key={i} />
                  ))}
                </S.CardGrid>
              ) : isError ? (
                <S.EmptyState>
                  <IconDatabase size={48} />
                  <span>Failed to load your card collection.</span>
                </S.EmptyState>
              ) : filteredCards.length === 0 ? (
                <S.EmptyState>
                  <IconPackage size={56} />
                  <span>No cards found.</span>
                  <S.PixelBtn variant="ghost" onClick={handleReset}>
                    Clear filters
                  </S.PixelBtn>
                </S.EmptyState>
              ) : (
                <>
                  <S.CardGrid
                    style={{
                      marginTop: 16,
                      opacity: isFetching ? 0.6 : 1,
                      transition: "opacity 0.2s",
                    }}
                  >
                    {filteredCards.map((card) => (
                      <div key={card.userCardId} data-card-item>
                        <InteractiveCard
                          card={card}
                          isSelected={
                            selectedCard?.userCardId === card.userCardId
                          }
                          onClick={() =>
                            setSelectedCard((prev) =>
                              prev?.userCardId === card.userCardId
                                ? null
                                : card,
                            )
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setSelectedCard((prev) =>
                                prev?.userCardId === card.userCardId
                                  ? null
                                  : card,
                              );
                            }
                          }}
                        />
                      </div>
                    ))}
                  </S.CardGrid>

                  {/* Pagination */}
                  <S.Pager>
                    <S.PixelBtn
                      variant="ghost"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                    >
                      <IconChevronLeft size={14} />
                    </S.PixelBtn>
                    <span>
                      Page {page} / {totalPages}
                    </span>
                    <S.PixelBtn
                      variant="ghost"
                      disabled={page >= totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      aria-label="Next page"
                    >
                      <IconChevronRight size={14} />
                    </S.PixelBtn>
                  </S.Pager>
                </>
              )}
            </>
          )}

          {activeTab === "deck" && (
            <S.ComingSoon accent="#7c3aed">
              <span className="cs-badge">
                <IconSword size={14} stroke={2} />
                Coming Soon
              </span>
              <p className="cs-title">Deck Builder</p>
              <p className="cs-desc">
                Craft the ultimate battle deck. Choose up to 60 cards from your
                collection, apply format rules, and export your list to share
                with friends.
              </p>
            </S.ComingSoon>
          )}

          {activeTab === "market" && (
            <S.ComingSoon accent="#f97316">
              <span className="cs-badge">
                <IconTrophy size={14} stroke={2} />
                Coming Soon
              </span>
              <p className="cs-title">Market Value</p>
              <p className="cs-desc">
                See live TCG market prices for every card in your binder, track
                your collection's total estimated value, and discover your
                rarest and most valuable cards.
              </p>
            </S.ComingSoon>
          )}
        </div>
      </S.Page>

      {/* ── Expanded Card Overlay ── */}
      <ExpandedCardOverlay
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </>
  );
};

export default TCGManagement;
