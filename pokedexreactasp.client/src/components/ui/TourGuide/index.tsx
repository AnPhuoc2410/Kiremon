import React, { useState, useEffect, useMemo } from "react";
import {
  Joyride,
  Step,
  STATUS,
  EventData,
  EVENTS,
  ACTIONS,
} from "react-joyride";
import { useNavigate, useLocation } from "react-router-dom";
import { Global, css } from "@emotion/react";
import { useLanguage } from "@/contexts";
import * as S from "./index.style";

// Multi-language translations for the tour steps
const getTourTranslation = (key: string, langId: number): string => {
  const EN = 9;
  const JA = 1;
  const ZH = 7;

  const translations: Record<string, Record<number, string>> = {
    welcome: {
      [EN]: "Welcome, Trainer! I am Professor Oak. Let me guide you on a comprehensive tour of the Kiremon portal. We will explore the Pokédex, Regions, Types, Generations, Poké Mart, and the Poke TCG Gallery!",
      [JA]: "ようこそ、トレーナー！私はオーキド博士です...このポータルの主要なセクション（図鑑、地方、タイプ、世代、フレンドリィショップ、カードギャラリー）をご案内しましょう！",
      [ZH]: "欢迎，训练家！我是大木博士。让我带你游览这个入口的各大主要版块（图鉴、地区、属性、世代、商店、卡牌展示馆）！",
    },
    pokedex: {
      [EN]: "This is the Pokédex dashboard! Here you can browse all known Pokémon, view their elements, and check their capture status marked with a Poké Ball icon.",
      [JA]: "こちらはポケモン図鑑です！すべてのポケモンを閲覧し、属性タイプや、捕獲マーク（モンスターボール）を確認できます。",
      [ZH]: "这是宝可梦图鉴！在这里你可以浏览所有已知的宝可梦，查看它们的属性，并追踪你的捕获进度（已捕获의宝可梦会显示精灵球图标）。",
    },
    search: {
      [EN]: "Looking for a specific Pokémon? Type its name here in the search bar. The Pokédex will immediately filter to match your query.",
      [JA]: "特定のポケモンをお探しですか？この検索バーに名前を入力すると、すぐに対象のポケモンが表示されます。",
      [ZH]: "正在寻找特定的宝可梦吗？在此搜索栏中输入名称，图鉴将立即过滤显示符合条件的宝可梦。",
    },
    nav: {
      [EN]: "Use the top navigation bar to quickly jump between key sections of Kiremon, such as your captured party, the Wild Area, mini-games, and more!",
      [JA]: "上部のナビゲーションバーを使用して、マイポケモン、ワイルドエリア、ミニゲームなどの主要なセクションに素早く切り替えることができます！",
      [ZH]: "使用顶部的导航栏，可以快速在我的宝可梦、荒野地带、迷你游戏等核心版块之间进行跳转！",
    },
    regions: {
      [EN]: "Explore Pokémon by regions! Select regions like Kanto, Johto, or Sinnoh to view their maps and local Pokémon species.",
      [JA]: "地方ごとにポケモンを探索しましょう！カントーやジョウトなどの地方を選択して、地図やその地方のポケモンを見ることができます。",
      [ZH]: "按地区探索宝可梦！选择关都、城都、神奥等地区来查看地图和当地的宝可梦物种。",
    },
    types: {
      [EN]: "This is the Type selection screen! Browse Pokémon grouped by elements like Fire, Water, and Grass, and check which ones you have captured.",
      [JA]: "こちらはタイプ選択画面です！ほのお、みず、くさなどの属性ごとにポケモンを閲覧し、捕まえたかどうか確認できます。",
      [ZH]: "这是属性选择界面！你可以按火、水、草等元素属性浏览宝可梦，并检查你捕获了哪些宝可梦。",
    },
    generations: {
      [EN]: "And here is the Generation explore screen! Browse Pokémon categorized by their original game release generations (Gen I through Gen IX), showing release years, starter details, and new species.",
      [JA]: "こちらは世代選択画面です！世代（第I世代から第IX世代まで）ごとにポケモンを分類し、ゲームの発売年や御三家画像、新しいポケモン数を確認できます。",
      [ZH]: "这是世代选择界面！你可以按游戏发布世代（第一世代到第九世代）浏览宝可梦，查看发布年份、御三家图片及新增宝可梦数量。",
    },
    market_sidebar: {
      [EN]: "Welcome to the Poké Mart! The sidebar on the left lets you filter shop items by categories such as Poké Balls, Medicine, and combat gear.",
      [JA]: "フレンドリィショップへようこそ！左側のサイドバーで、モンスターボールやキズぐすり、戦闘用アイテムなどのカテゴリー別に商品を絞り込むことができます。",
      [ZH]: "欢迎来到宝可梦商店！左侧的分类栏可以让你按精灵球、药剂、战斗装备等类别筛选商品。",
    },
    market_items: {
      [EN]: "This is the items grid on the right! It lists all available gear in the selected category. Simply click any item to see its detailed description and price.",
      [JA]: "右側は商品リストです！選択したカテゴリーのアイテムが一覧表示され、クリックすると詳細な説明や価格を確認できます。",
      [ZH]: "右侧是商品列表！这里展示了所选类别下的所有道具，点击任意道具即可查看其详细描述和价格。",
    },
    market_detail: {
      [EN]: "When you click an item, this detail panel opens! It reveals the item's effects, price in Poké-dollars, and a list of wild Pokémon that may carry this item in the wild.",
      [JA]: "アイテムをクリックすると、この詳細パネルが開きます！アイテムの効果や価格、さらに野生でそのアイテムを持っている可能性のあるポケモンの一覧が表示されます。",
      [ZH]: "点击道具后，会打开此详细面板！里面展示了道具的效果、售价，以及野外可能携带该道具的宝可梦列表。",
    },
    tcg_search: {
      [EN]: "Welcome to the Poke TCG Gallery! Enter a Pokémon's name in this search bar to view all official trading card releases for that Pokémon.",
      [JA]: "カードギャラリーへようこそ！検索バーにポケモンの名前を入力すると、そのポケモンの公式トレーディングカードがすべて表示されます。",
      [ZH]: "欢迎来到卡牌展示馆！在搜索栏中输入宝可梦的名称，即可展示该宝可梦所有的官方集换式卡牌。",
    },
    tcg_filters: {
      [EN]: "You can also use the filters below to refine card results by Rarity, Regulation mark, or Subtype, helping you easily find rare cards!",
      [JA]: "検索バーの下にあるフィルターを使用して、レア度、レギュレーションマーク、サブタイプでカードを絞り込み、目当てのカードをすぐに見つけることができます！",
      [ZH]: "你还可以使用下方的筛选框，按稀有度、赛制标记或子类别来过滤卡牌，轻松找到心仪的卡牌！",
    },
    conclusion: {
      [EN]: "That completes Professor Oak's grand tour! Venture forth, catch wild Pokémon, compile your team, and complete your Pokédex. Good luck, Trainer!",
      [JA]: "これでポータルの使い方はバッチリです。さあ冒険へ出発し、新しいポケモンを見つけ、すべて捕まえましょう！",
      [ZH]: "现在你已经完全掌握了入口的使用方法。出发吧，去发现新物种，收服所有宝可梦！",
    },
    back: {
      [EN]: "Back",
      [JA]: "戻る",
      [ZH]: "返回",
    },
    next: {
      [EN]: "Next",
      [JA]: "次へ",
      [ZH]: "下一步",
    },
    finish: {
      [EN]: "Finish",
      [JA]: "終了",
      [ZH]: "完成",
    },
    skip: {
      [EN]: "Skip",
      [JA]: "スキップ",
      [ZH]: "跳过",
    },
  };

  const item = translations[key];
  if (!item) return key;
  return item[langId] || item[EN] || key;
};

// Helper to open/close dropdowns in the Header
const toggleDropdown = (id: string, shouldOpen: boolean) => {
  const container = document.getElementById(id);
  if (!container) return;
  const button = container.querySelector("button") || container.querySelector("a") || container.querySelector("[role='button']") || container.firstElementChild;
  if (!button) return;
  const isOpen = button.classList.contains("active");

  if (shouldOpen && !isOpen) {
    (button as HTMLElement).click();
  } else if (!shouldOpen && isOpen) {
    (button as HTMLElement).click();
  }
};

const TourGuide: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { languageId } = useLanguage();

  const [run, setRun] = useState(false);
  const [tourKey, setTourKey] = useState(0);

  // Helper to ensure we are on the correct route and the target element is loaded/stable
  const ensureRouteAndElement = (route: string, targetSelector: string) => {
    return () => {
      return new Promise<void>((resolve) => {
        const currentPath = window.location.pathname;
        const needsNavigation = currentPath !== route;

        if (needsNavigation) {
          navigate(route);
        } else {
          // If already on the correct page and target exists, resolve immediately
          if (targetSelector === "body") {
            resolve();
            return;
          }
          const immediateElement = document.querySelector(targetSelector);
          if (immediateElement) {
            resolve();
            return;
          }
        }

        if (targetSelector === "body") {
          setTimeout(() => resolve(), 300);
          return;
        }

        // Poll for the target element to exist in the DOM
        let attempts = 0;
        const maxAttempts = 100; // 10 seconds max for slow API/network loads
        const interval = setInterval(() => {
          const element = document.querySelector(targetSelector);
          attempts++;

          if (element) {
            clearInterval(interval);
            // If we navigated, wait a short moment for layout to settle, else resolve immediately
            setTimeout(() => {
              resolve();
            }, needsNavigation ? 400 : 0);
          } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            console.warn(`Tour target element "${targetSelector}" not found in DOM.`);
            resolve(); // Resolve to avoid blocking the tour
          }
        }, 100);
      });
    };
  };

  // Step definitions mapped to DOM selectors and paths
  const steps = useMemo<(Step & { route?: string })[]>(
    () => [
      {
        target: "body",
        placement: "center",
        content: getTourTranslation("welcome", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "body"),
      },
      {
        target: "#tour-pokedex-grid",
        placement: "top",
        content: getTourTranslation("pokedex", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-pokedex-grid"),
      },
      {
        target: "#tour-search-container",
        placement: "bottom",
        content: getTourTranslation("search", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-search-container"),
      },
      {
        target: "#tour-nav-pokedex",
        placement: "bottom",
        content: getTourTranslation("nav", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-nav-pokedex"),
      },
      {
        target: "#tour-regions-grid",
        placement: "top",
        content: getTourTranslation("regions", languageId),
        route: "/explore/regions",
        disableBeacon: true,
        before: ensureRouteAndElement("/explore/regions", "#tour-regions-grid"),
      },
      {
        target: "#tour-types-grid",
        placement: "top",
        content: getTourTranslation("types", languageId),
        route: "/explore/types",
        disableBeacon: true,
        before: ensureRouteAndElement("/explore/types", "#tour-types-grid"),
      },
      {
        target: "#tour-generations-grid",
        placement: "top",
        content: getTourTranslation("generations", languageId),
        route: "/explore/generations",
        disableBeacon: true,
        before: ensureRouteAndElement("/explore/generations", "#tour-generations-grid"),
      },
      {
        target: "#tour-market-sidebar",
        placement: "right",
        content: getTourTranslation("market_sidebar", languageId),
        route: "/poke-mart",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-mart", "#tour-market-sidebar"),
      },
      {
        target: "#tour-market-content",
        placement: "top",
        content: getTourTranslation("market_items", languageId),
        route: "/poke-mart",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-mart", "#tour-market-content"),
      },
      {
        target: "#tour-market-description",
        placement: "left",
        content: getTourTranslation("market_detail", languageId),
        route: "/poke-mart",
        disableBeacon: true,
        before: () => {
          return ensureRouteAndElement("/poke-mart", "#tour-market-description")().then(() => {
            const firstItem = document.getElementById("tour-market-first-item");
            if (firstItem) {
              (firstItem as HTMLElement).click();
            }
          });
        },
      },
      {
        target: "#tour-tcg-search",
        placement: "bottom",
        content: getTourTranslation("tcg_search", languageId),
        route: "/poke-tcg",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-tcg", "#tour-tcg-search"),
      },
      {
        target: "#tour-tcg-filters",
        placement: "top",
        content: getTourTranslation("tcg_filters", languageId),
        route: "/poke-tcg",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-tcg", "#tour-tcg-filters"),
      },
      {
        target: "body",
        placement: "center",
        content: getTourTranslation("conclusion", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "body"),
      },
    ],
    [languageId, navigate],
  );

  // Auto-start for first-time users on landing in /pokemons dashboard
  useEffect(() => {
    const hasCompleted = localStorage.getItem("hasCompletedTour");
    if (!hasCompleted && location.pathname === "/pokemons") {
      const timer = setTimeout(() => {
        setRun(true);
      }, 1200); // 1.2s delay to ensure the page renders completely
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  // Listen for the custom "start-tour-guide" event dispatched from the Header
  useEffect(() => {
    const handleStartTourEvent = () => {
      handleStartTour();
    };
    window.addEventListener("start-tour-guide", handleStartTourEvent);
    return () => {
      window.removeEventListener("start-tour-guide", handleStartTourEvent);
    };
  }, [location.pathname, navigate]);

  const handleJoyrideCallback = (data: EventData) => {
    const { status } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      localStorage.setItem("hasCompletedTour", "true");
      // Close dropdowns
      toggleDropdown("tour-nav-games", false);
      toggleDropdown("tour-nav-explore", false);
    }
  };

  const handleStartTour = () => {
    localStorage.removeItem("hasCompletedTour");
    setTourKey((prev) => prev + 1); // Reset tour to index 0 on start/restart
    if (location.pathname !== "/pokemons") {
      navigate("/pokemons");
      setTimeout(() => {
        setRun(true);
      }, 500);
    } else {
      setRun(true);
    }
  };

  // Custom retro DS dialogue box renderer for React Joyride
  const PokemonTooltip = ({
    index,
    step,
    isLastStep,
    backProps,
    primaryProps,
    skipProps,
    tooltipProps,
  }: any) => {
    const { title: primaryTitle, ...cleanPrimaryProps } = primaryProps;
    const { title: backTitle, ...cleanBackProps } = backProps;
    const { title: skipTitle, ...cleanSkipProps } = skipProps;

    return (
      <S.TooltipWrapper {...tooltipProps}>
        <S.RPGDialogueBox>
          <S.DialogueContainer>
            <S.AvatarContainer>
              <img src="/images/professor_guide.png" alt="Professor Oak" />
            </S.AvatarContainer>

            <S.DialogueContent>
              <S.SpeakerTitle>Prof. Oak</S.SpeakerTitle>
              <S.DialogueText>{step.content}</S.DialogueText>
              <S.DialogueFooter>
                <S.SkipButton
                  {...cleanSkipProps}
                  onClick={(e) => {
                    setRun(false);
                    localStorage.setItem("hasCompletedTour", "true");
                    if (skipProps.onClick) {
                      skipProps.onClick(e);
                    }
                  }}
                >
                  {getTourTranslation("skip", languageId)}
                </S.SkipButton>
                <S.ButtonGroup>
                  {index > 0 && (
                    <S.RetroButton variant="secondary" {...cleanBackProps}>
                      {getTourTranslation("back", languageId)}
                    </S.RetroButton>
                  )}
                  <S.RetroButton
                    variant="primary"
                    {...cleanPrimaryProps}
                    onClick={(e) => {
                      if (isLastStep) {
                        setRun(false);
                        localStorage.setItem("hasCompletedTour", "true");
                      }
                      if (primaryProps.onClick) {
                        primaryProps.onClick(e);
                      }
                    }}
                  >
                    {isLastStep
                      ? getTourTranslation("finish", languageId)
                      : getTourTranslation("next", languageId)}
                  </S.RetroButton>
                </S.ButtonGroup>
              </S.DialogueFooter>
            </S.DialogueContent>
          </S.DialogueContainer>
        </S.RPGDialogueBox>
      </S.TooltipWrapper>
    );
  };

  return (
    <>
      {run && (
        <>
          <Global
            styles={css`
              .react-joyride__floater,
              .react-joyride__tooltip {
                position: fixed !important;
                bottom: 0 !important;
                left: 0 !important;
                right: 0 !important;
                top: auto !important;
                transform: none !important;
                width: 100% !important;
                max-width: none !important;
                height: auto !important;
                box-shadow: none !important;
                background-color: transparent !important;
                padding: 0 !important;
                z-index: 10001 !important;
              }
            `}
          />
          <Joyride
            key={tourKey}
            steps={steps}
            run={run}
            onEvent={handleJoyrideCallback}
            continuous={true}
            tooltipComponent={PokemonTooltip}
            options={{
              overlayClickAction: false,
              dismissKeyAction: false,
              blockTargetInteraction: true,
              buttons: ["back", "close", "primary", "skip"],
            }}
            styles={{
              overlay: {
                backgroundColor: "rgba(0, 0, 0, 0.65)",
              },
            }}
          />
        </>
      )}
    </>
  );
};

export default TourGuide;
