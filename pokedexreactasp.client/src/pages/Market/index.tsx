import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShopContainer,
  ShopInner,
  MainContent,
  ContentArea,
  ItemsContainer,
  DescriptionPanel,
  ScrollToTop,
  PokeballImage,
  FallbackIcon,
  SidebarContainer,
  SidebarToggle,
  SidebarOverlay,
} from "./Market.styles";
import { CategoryTabs, ItemGrid, ItemDescriptionBox } from "./components";
import { usePokeMartQuery, useSearchItem } from "@/hooks/queries";
import { Header } from "@/components/ui";
import { pokeItemService } from "@/services";
import { Item } from "@/types/market.types";
import { useLanguage } from "@/contexts";
import { t } from "@/utils/uiI18n";

const Market: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [pokeballSprite, setPokeballSprite] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const { languageId } = useLanguage();

  const {
    categories,
    categoriesLoading,
    categoriesError,
    refetchCategories,
    selectedCategory,
    setSelectedCategory,
    items,
    itemsLoading,
    itemsError,
    refetchItems,
  } = usePokeMartQuery();

  const itemNameFromUrl = searchParams.get("item");
  const { searchResult, isLoading: isSearchingItem } = useSearchItem(
    itemNameFromUrl,
    !!itemNameFromUrl && categories.length > 0,
  );

  const selectedCategorySlug =
    categories.find((c) => c.id === selectedCategory)?.name ?? "";

  useEffect(() => {
    if (searchResult && !isSearchingItem) {
      setSelectedCategory(searchResult.categoryId);
      setTimeout(() => {
        setSelectedItem(searchResult.item);
        setSearchParams({}, { replace: true });
      }, 300);
    }
  }, [searchResult, isSearchingItem, setSelectedCategory, setSearchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchPokeballSprite = async () => {
      const sprite = await pokeItemService.getPokeballSprite();
      setPokeballSprite(sprite);
    };
    fetchPokeballSprite();
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [selectedCategory]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  return (
    <>
      <ShopContainer>
        <Header
          title={t("market.title", languageId)}
          subtitle={t("market.subtitle", languageId)}
        />

        <ShopInner>
          <MainContent>
            <SidebarContainer id="tour-market-sidebar">
              <SidebarToggle onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {t("market.categories", languageId)}
              </SidebarToggle>

              <SidebarOverlay
                $isOpen={sidebarOpen}
                onClick={() => setSidebarOpen(false)}
              />

              <CategoryTabs
                categories={categories}
                loading={categoriesLoading}
                error={categoriesError}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onRetry={refetchCategories}
                isOpen={sidebarOpen}
              />
            </SidebarContainer>

            <ContentArea id="tour-market-content">
              <ItemsContainer>
                <ItemGrid
                  items={items}
                  loading={itemsLoading}
                  error={itemsError}
                  selectedItemId={selectedItem?.id || null}
                  onSelectItem={handleItemClick}
                  onRetry={refetchItems}
                />
              </ItemsContainer>

              <DescriptionPanel>
                <ItemDescriptionBox
                  item={selectedItem}
                  categoryId={selectedCategory}
                  categoryName={selectedCategorySlug}
                  onClose={() => setSelectedItem(null)}
                />
              </DescriptionPanel>
            </ContentArea>
          </MainContent>
        </ShopInner>
      </ShopContainer>

      <ScrollToTop
        onClick={scrollToTop}
        className={showScrollTop ? "visible" : ""}
        aria-label="Scroll to top"
      >
        {pokeballSprite ? (
          <PokeballImage src={pokeballSprite} alt="Poke Ball" />
        ) : (
          <FallbackIcon>↑</FallbackIcon>
        )}
      </ScrollToTop>
    </>
  );
};

export default Market;
