import React, { useEffect, useState, useMemo, useRef } from "react";
import gsap from "gsap";
import toast from "react-hot-toast";
import {
  IconSearch,
  IconRefresh,
  IconEye,
  IconCalendar,
  IconUser,
  IconExternalLink,
} from "@tabler/icons-react";
import { Header, Navbar } from "@/components/ui";
import { useLanguage } from "@/contexts";
import { t } from "@/utils/uiI18n";
import { newsService, PokemonNews } from "@/services/news/news.service";
import * as S from "./index.style";

const PokeNews: React.FC = () => {
  const { languageId } = useLanguage();
  const pageRef = useRef<HTMLDivElement | null>(null);

  const [news, setNews] = useState<PokemonNews[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<PokemonNews | null>(
    null,
  );
  const [navHeight, setNavHeight] = useState<number>(0);
  const navRef = useRef<HTMLDivElement>(null);

  // Fetch news on mount
  const fetchNews = async (showToast: boolean = false) => {
    try {
      if (!showToast) setLoading(true);
      const data = await newsService.getLatestNews(30);

      // Sort news by published date descending
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.publishedDate).getTime() -
          new Date(a.publishedDate).getTime(),
      );

      setNews(sortedData);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      toast.error(
        t("error.loadNews", languageId) || "Failed to load Pokémon news.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    if (navRef.current) {
      setNavHeight(navRef.current.clientHeight);
    }
  }, []);

  // Sync news handler
  const handleSync = async () => {
    if (syncing) return;
    setSyncing(true);
    const syncToast = toast.loading(t("news.syncing", languageId));

    try {
      const result = await newsService.syncNews();
      toast.success(
        `${t("news.syncSuccess", languageId)} (${result.inserted} new, ${result.updated} updated)`,
        { id: syncToast },
      );
      await fetchNews(true);
    } catch (err) {
      console.error("Failed to sync news:", err);
      toast.error(t("news.syncFailed", languageId), { id: syncToast });
    } finally {
      setSyncing(false);
    }
  };

  // View count increment handler
  const handleOpenArticle = async (article: PokemonNews) => {
    setSelectedArticle(article);
    try {
      await newsService.incrementViews(article.id);
      // Update local state to increment view count instantly
      setNews((prevNews) =>
        prevNews.map((n) =>
          n.id === article.id ? { ...n, viewCount: n.viewCount + 1 } : n,
        ),
      );
    } catch (err) {
      console.error("Failed to increment views:", err);
    }
  };

  // Extract all categories dynamically from news items
  const categories = useMemo(() => {
    const cats = new Set<string>();
    news.forEach((item) => {
      if (item.category) {
        // Normalize categories to title case (e.g. Games, TCG)
        const normalized = item.category.trim();
        if (normalized) cats.add(normalized);
      }
    });
    return ["All", ...Array.from(cats)];
  }, [news]);

  // Filtered and Searched news list
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [news, selectedCategory, searchQuery]);

  const featuredArticle = useMemo(() => {
    if (
      filteredNews.length === 0 ||
      searchQuery ||
      selectedCategory !== "All"
    ) {
      return null;
    }
    return filteredNews[0];
  }, [filteredNews, searchQuery, selectedCategory]);

  // Rest of the news articles for the grid
  const gridArticles = useMemo(() => {
    if (!featuredArticle) return filteredNews;
    return filteredNews.slice(1);
  }, [filteredNews, featuredArticle]);

  // Format Date utility
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(navigator.language || "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // GSAP animations for stagger list entry
  useEffect(() => {
    if (loading || filteredNews.length === 0) return;

    const ctx = gsap.context(() => {
      // Fade in sync banner & hero
      gsap.fromTo(
        ".news-banner, .news-hero",
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      );

      // Stagger animate cards
      gsap.fromTo(
        ".news-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.04,
          ease: "power1.out",
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, [loading, filteredNews.length, selectedCategory]);

  // Modal animation on open
  useEffect(() => {
    if (!selectedArticle) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".news-modal-content",
        { scale: 0.9, y: 20, opacity: 0 },
        { scale: 1, y: 0, opacity: 1, duration: 0.3, ease: "back.out(1.1)" },
      );
    });

    return () => ctx.revert();
  }, [selectedArticle]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedArticle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedArticle]);

  return (
    <S.Container style={{ marginBottom: navHeight }} ref={pageRef}>
      <Header
        title={t("news.title", languageId)}
        subtitle={t("news.subtitle", languageId)}
      />

      <S.Page>
        {/* News Sync Banner */}
        <S.SyncBanner className="news-banner">
          <S.SyncInfo>
            <S.PokéballIcon
              src="/pokeball-logo.png"
              alt="Pokéball"
              $loading={syncing}
            />
            <span>
              {syncing
                ? t("news.syncing", languageId)
                : `${t("news.publishedBy", languageId)} PokéJungle RSS Feed. ${news.length > 0 ? `Latest: ${formatDate(news[0].publishedDate)}` : ""}`}
            </span>
          </S.SyncInfo>
          <S.SyncButton onClick={handleSync} disabled={syncing}>
            <IconRefresh size={16} />
            {t("news.sync", languageId)}
          </S.SyncButton>
        </S.SyncBanner>

        {loading ? (
          // Loading skeletons
          <>
            <S.NewsGrid>
              {Array.from({ length: 6 }).map((_, idx) => (
                <S.SkeletonCard key={idx}>
                  <S.SkeletonImage />
                  <S.SkeletonBody>
                    <S.SkeletonText $width="40%" $height="18px" />
                    <S.SkeletonText $width="90%" $height="24px" />
                    <S.SkeletonText $width="100%" $height="40px" />
                    <div
                      style={{
                        marginTop: "auto",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <S.SkeletonText $width="30%" />
                      <S.SkeletonText $width="20%" />
                    </div>
                  </S.SkeletonBody>
                </S.SkeletonCard>
              ))}
            </S.NewsGrid>
          </>
        ) : news.length === 0 ? (
          <S.SyncBanner
            style={{
              justifyContent: "center",
              background: "#f9f9f9",
              color: "#666",
              border: "1px solid #ccc",
            }}
          >
            <span>{t("news.noNews", languageId)}</span>
          </S.SyncBanner>
        ) : (
          <>
            {/* Featured Article Section */}
            {featuredArticle && (
              <S.HeroSection
                className="news-hero"
                onClick={() => handleOpenArticle(featuredArticle)}
              >
                <S.HeroImageWrapper>
                  <S.HeroImage
                    src={featuredArticle.imageUrl || "/substitute.png"}
                    alt={featuredArticle.title}
                    loading="eager"
                  />
                </S.HeroImageWrapper>
                <S.HeroContent>
                  <S.CategoryBadge $category={featuredArticle.category}>
                    {featuredArticle.category}
                  </S.CategoryBadge>
                  <S.HeroTitle>{featuredArticle.title}</S.HeroTitle>
                  <S.HeroSummary>{featuredArticle.summary}</S.HeroSummary>
                  <S.HeroMeta>
                    <span>
                      <IconUser
                        size={16}
                        style={{
                          display: "inline",
                          marginRight: 4,
                          verticalAlign: "middle",
                        }}
                      />
                      {featuredArticle.author || "PokéJungle"}
                    </span>
                    <span>
                      <IconCalendar
                        size={16}
                        style={{
                          display: "inline",
                          marginRight: 4,
                          verticalAlign: "middle",
                        }}
                      />
                      {formatDate(featuredArticle.publishedDate)}
                    </span>
                    <span>
                      <IconEye
                        size={16}
                        style={{
                          display: "inline",
                          marginRight: 4,
                          verticalAlign: "middle",
                        }}
                      />
                      {featuredArticle.viewCount} {t("news.views", languageId)}
                    </span>
                  </S.HeroMeta>
                </S.HeroContent>
              </S.HeroSection>
            )}

            {/* Filter and Search Toolbar */}
            <S.Toolbar>
              <S.FilterTabs>
                {categories.map((cat) => (
                  <S.FilterTab
                    key={cat}
                    $active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat === "All" ? t("news.categoryAll", languageId) : cat}
                  </S.FilterTab>
                ))}
              </S.FilterTabs>

              <S.SearchBox>
                <IconSearch size={18} color="#999" />
                <S.SearchInput
                  type="text"
                  placeholder={t("news.searchPlaceholder", languageId)}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </S.SearchBox>
            </S.Toolbar>

            {/* News Articles Grid */}
            {gridArticles.length === 0 ? (
              <S.SyncBanner
                style={{
                  justifyContent: "center",
                  background: "#f9f9f9",
                  color: "#666",
                  border: "1px dashed #ccc",
                }}
              >
                <span>{t("news.noNews", languageId)}</span>
              </S.SyncBanner>
            ) : (
              <S.NewsGrid>
                {gridArticles.map((article) => (
                  <S.Card
                    key={article.id}
                    className="news-card"
                    onClick={() => handleOpenArticle(article)}
                  >
                    <S.CardImageWrapper>
                      <S.CardImage
                        src={article.imageUrl || "/substitute.png"}
                        alt={article.title}
                        loading="lazy"
                      />
                    </S.CardImageWrapper>
                    <S.CardBody>
                      <S.CategoryBadge
                        $category={article.category}
                        style={{ fontSize: "14px", padding: "2px 6px" }}
                      >
                        {article.category}
                      </S.CategoryBadge>
                      <S.CardTitle>{article.title}</S.CardTitle>
                      <S.CardSummary>{article.summary}</S.CardSummary>
                    </S.CardBody>
                    <S.CardFooter>
                      <span>{formatDate(article.publishedDate)}</span>
                      <S.ViewCount>
                        <IconEye size={14} />
                        {article.viewCount}
                      </S.ViewCount>
                    </S.CardFooter>
                  </S.Card>
                ))}
              </S.NewsGrid>
            )}
          </>
        )}
      </S.Page>

      {/* Detail Modal */}
      {selectedArticle && (
        <S.ModalOverlay onClick={() => setSelectedArticle(null)}>
          <S.ModalContent
            className="news-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <S.ModalCloseButton onClick={() => setSelectedArticle(null)}>
              ×
            </S.ModalCloseButton>

            <S.ModalImageWrapper>
              <S.ModalHeroImage
                src={selectedArticle.imageUrl || "/substitute.png"}
                alt={selectedArticle.title}
              />
            </S.ModalImageWrapper>

            <S.ModalBody>
              <S.CategoryBadge $category={selectedArticle.category}>
                {selectedArticle.category}
              </S.CategoryBadge>
              <S.ModalTitle>{selectedArticle.title}</S.ModalTitle>

              <S.ModalMeta>
                <span>
                  <IconUser
                    size={16}
                    style={{
                      display: "inline",
                      marginRight: 4,
                      verticalAlign: "middle",
                    }}
                  />
                  {selectedArticle.author || "PokéJungle"}
                </span>
                <span>
                  <IconCalendar
                    size={16}
                    style={{
                      display: "inline",
                      marginRight: 4,
                      verticalAlign: "middle",
                    }}
                  />
                  {formatDate(selectedArticle.publishedDate)}
                </span>
                <span>
                  <IconEye
                    size={16}
                    style={{
                      display: "inline",
                      marginRight: 4,
                      verticalAlign: "middle",
                    }}
                  />
                  {selectedArticle.viewCount} {t("news.views", languageId)}
                </span>
              </S.ModalMeta>

              <S.ModalDescription>{selectedArticle.summary}</S.ModalDescription>

              {selectedArticle.sourceUrl && (
                <S.ExternalLinkButton
                  href={selectedArticle.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconExternalLink size={20} />
                  {t("news.readMore", languageId)}
                </S.ExternalLinkButton>
              )}
            </S.ModalBody>
          </S.ModalContent>
        </S.ModalOverlay>
      )}

      <Navbar ref={navRef} />
    </S.Container>
  );
};

export default PokeNews;
