import { createRef, useEffect, useMemo, useState } from "react";

import {
  Button,
  Header,
  ItemCard,
  Loading,
  Navbar,
  Text,
} from "@/components/ui";
import { useItemCategories, useMyInventory } from "@/hooks/queries";
import {
  InventorySort,
  MyInventoryQuery,
} from "@/types/inventory.types";
import {
  getCategoryDisplayName,
  getInventoryCategoryMeta,
} from "@/types/market.types";

import { BagCategoryTabs } from "./components/BagCategoryTabs";
import { BagItemDescriptionBox } from "./components/BagItemDescriptionBox";
import * as S from "./index.style";

const DEFAULT_PAGE_SIZE = 30;

const Bag = () => {
  const navRef = createRef<HTMLDivElement>();

  const [page, setPage] = useState(1);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [sort, setSort] = useState<InventorySort>("name-asc");
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    categories: pokeApiCategories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useItemCategories();

  const selectedCategory = useMemo(
    () =>
      pokeApiCategories.find((category) => category.id === selectedCategoryId) ??
      null,
    [pokeApiCategories, selectedCategoryId],
  );

  useEffect(() => {
    if (pokeApiCategories.length > 0 && selectedCategoryId == null) {
      setSelectedCategoryId(pokeApiCategories[0].id);
    }
  }, [pokeApiCategories, selectedCategoryId]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [selectedCategoryId]);

  const query: MyInventoryQuery = useMemo(
    () => ({
      page,
      pageSize: DEFAULT_PAGE_SIZE,
      categoryName: selectedCategory?.name,
      sort,
    }),
    [page, selectedCategory?.name, sort],
  );

  const inventoryQuery = useMyInventory(query, !!selectedCategory?.name);
  const items = inventoryQuery.data?.items ?? [];
  const categorySummaries = inventoryQuery.data?.categories ?? [];
  const totalCount = inventoryQuery.data?.totalCount ?? 0;
  const pageSize = inventoryQuery.data?.pageSize ?? DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const summaryByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const summary of categorySummaries) {
      map.set(summary.categoryName.toLowerCase(), summary.stackCount);
    }
    return map;
  }, [categorySummaries]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  const activeCategoryMeta = getInventoryCategoryMeta(
    selectedCategory?.name ?? "other",
    selectedCategory?.itempocket?.name,
  );

  const activeCategoryLabel = selectedCategory
    ? getCategoryDisplayName(selectedCategory)
    : "Items";

  useEffect(() => {
    if (items.length === 0) {
      setSelectedItemId(null);
      return;
    }

    if (selectedItemId == null || !items.some((i) => i.id === selectedItemId)) {
      setSelectedItemId(items[0].id);
    }
  }, [items, selectedItemId]);

  const handleCategoryChange = (categoryId: number) => {
    setPage(1);
    setSelectedCategoryId(categoryId);
    setSelectedItemId(null);
  };

  const isBootstrapping = categoriesLoading;
  const showItemListOverlay =
    inventoryQuery.isFetching && items.length > 0;
  const bagIsEmpty =
    categorySummaries.length === 0 &&
    !inventoryQuery.isFetching &&
    !categoriesLoading;

  return (
    <>
      <S.Page style={{ marginBottom: navRef.current?.clientHeight ?? 120 }}>
        <Header title="My Bag" subtitle="Items you've collected" />

        {isBootstrapping ? (
          <Loading label="Loading your bag..." />
        ) : categoriesError ? (
          <Text>Failed to load categories.</Text>
        ) : pokeApiCategories.length === 0 ? (
          <S.EmptyBag>No item categories available.</S.EmptyBag>
        ) : (
          <S.BagInner>
            <S.MainContent>
              <S.SidebarContainer>
                <S.SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Categories
                </S.SidebarToggle>

                <S.SidebarOverlay
                  $isOpen={sidebarOpen}
                  onClick={() => setSidebarOpen(false)}
                />

                <BagCategoryTabs
                  categories={pokeApiCategories}
                  selectedCategoryId={selectedCategoryId}
                  ownedCountByCategory={summaryByCategory}
                  onSelectCategory={handleCategoryChange}
                  isOpen={sidebarOpen}
                />
              </S.SidebarContainer>

              <S.ContentColumn>
                <S.ListToolbar>
                  <S.ToolbarTitle $accent={activeCategoryMeta.accent}>
                    <span>{activeCategoryLabel}</span>
                  </S.ToolbarTitle>
                  <S.ToolbarActions>
                    <S.SortSelect
                      value={sort}
                      onChange={(e) => {
                        setPage(1);
                        setSort(e.target.value as InventorySort);
                      }}
                    >
                      <option value="name-asc">Name A-Z</option>
                      <option value="name-desc">Name Z-A</option>
                      <option value="qty-desc">Qty high → low</option>
                      <option value="qty-asc">Qty low → high</option>
                      <option value="updated-desc">Recently updated</option>
                    </S.SortSelect>
                    <span>
                      {totalCount} stack{totalCount === 1 ? "" : "s"}
                    </span>
                  </S.ToolbarActions>
                </S.ListToolbar>

                <S.ItemList>
                  {showItemListOverlay ? (
                    <S.ItemListOverlay>Updating...</S.ItemListOverlay>
                  ) : null}

                  {inventoryQuery.isLoading && items.length === 0 ? (
                    <S.EmptyList>Loading items...</S.EmptyList>
                  ) : bagIsEmpty && items.length === 0 ? (
                    <S.EmptyList>
                      <span style={{ fontSize: "2rem" }}>🎒</span>
                      <span>Your bag is empty.</span>
                      <span>Visit the Market to buy items.</span>
                    </S.EmptyList>
                  ) : items.length === 0 ? (
                    <S.EmptyList>
                      <span style={{ fontSize: "2rem" }}>📦</span>
                      <span>No items in this category.</span>
                    </S.EmptyList>
                  ) : (
                    items.map((item) => (
                      <ItemCard
                        key={item.id}
                        variant="list"
                        selected={selectedItemId === item.id}
                        accentColor={activeCategoryMeta.accent}
                        name={item.name}
                        spriteUrl={item.spriteUrl}
                        quantity={item.quantity}
                        onClick={() => setSelectedItemId(item.id)}
                      />
                    ))
                  )}
                </S.ItemList>

                <BagItemDescriptionBox
                  item={selectedItem}
                  accent={activeCategoryMeta.accent}
                />

                {totalPages > 1 ? (
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
                      onClick={() =>
                        setPage((prev) => Math.min(totalPages, prev + 1))
                      }
                    >
                      Next
                    </Button>
                  </S.Pager>
                ) : null}
              </S.ContentColumn>
            </S.MainContent>
          </S.BagInner>
        )}
      </S.Page>

      <Navbar ref={navRef} />
    </>
  );
};

export default Bag;
