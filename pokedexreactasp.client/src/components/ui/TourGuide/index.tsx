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
      [EN]: "Welcome, Trainer! I am Professor Oak. Let me guide you through this portal to help you understand the Pokémon world!",
      [JA]: "ようこそ、トレーナー！私はオーキド博士です。ポケモン世界を理解できるよう、このポータルを案内しましょう！",
      [ZH]: "欢迎，训练家！我是大木博士。让我带你浏览这个入口，帮助你了解宝可梦世界！",
    },
    search: {
      [EN]: "Looking for a specific Pokémon? Use this search bar to quickly find any Pokémon by its name!",
      [JA]: "特定のポケモンをお探しですか？この検索バーを使って、名前からすぐにポケモンを見つけられます！",
      [ZH]: "正在寻找特定的宝可梦吗？使用这个搜索栏可以根据名称快速找到任何宝可梦！",
    },
    pokedex: {
      [EN]: "This is the Pokédex! Here you can browse all known Pokémon, view their details, and see if you have captured them.",
      [JA]: "こちらはポケモン図鑑です！登録されているすべてのポケモンを閲覧し、詳細情報や捕獲状況を確認できます。",
      [ZH]: "这是宝可梦图鉴！在这里你可以浏览所有已知的宝可梦，查看它们的详细信息，并查看你是否已经捕获了它们。",
    },
    mypokemon: {
      [EN]: "Check out My Pokémon! Once you capture Pokémon from games or challenges, they will appear here. You can mark favorites or release them back into the wild.",
      [JA]: "「マイポケモン」を確認しましょう！ゲームやチャレンジで捕まえたポケモンがここに表示されます。お気に入りに登録したり、野生に逃がしたりできます。",
      [ZH]: "查看我的宝可梦！一旦你在游戏或挑战中捕获了宝可梦，它们就会出现在这里。你可以标记喜爱的宝可梦或将它们放生回野外。",
    },
    games: {
      [EN]: "Feeling playful? Hover over Mini Games to access Combat Team, Who's That Pokémon, Type Matchup, and Catch Challenge!",
      [JA]: "遊んでみますか？ミニゲームメニューから、コンバットチーム、だれだ？、タイプ相性チェッカー、キャッチチャレンジにアクセスできます！",
      [ZH]: "想玩游戏吗？将鼠标悬停在迷你游戏上，即可访问对战团队、是谁的宝可梦、属性相性以及捕获挑战！",
    },
    explore: {
      [EN]: "Use the Explore menu to browse by Regions, Types, or Generations. Let's head over to the Regions page next!",
      [JA]: "地方、タイプ、世代ごとに探索してみましょう。次は地方のページへ行ってみましょう！",
      [ZH]: "使用探索菜单按地区、属性或世代进行浏览。接下来让我们前往地区页面！",
    },
    regions: {
      [EN]: "Welcome to the Region selection! You can see various regions like Kanto, Johto, Sinnoh, and more. Click on them to see their maps and local Pokémon!",
      [JA]: "地方選択画面へようこそ！カントー、ジョウト、シンオウなど様々な地方があります。クリックすると、地図や出現するポケモンを見られます！",
      [ZH]: "欢迎来到地区选择！你可以看到关都、城都、神奥等多个地区。点击它们可以查看地图和当地的宝可梦！",
    },
    types: {
      [EN]: "This is the Type selection screen! You can browse Pokémon grouped by elements like Fire, Water, and Grass, and check which ones you have captured.",
      [JA]: "こちらはタイプ選択画面です！ほのお、みず、くさなどの属性ごとにポケモンを閲覧し、捕まえたかどうか確認できます。",
      [ZH]: "这是属性选择界面！你可以按火、水、草等元素属性浏览宝可梦，并检查你捕获了哪些宝可梦。",
    },
    market_nav: {
      [EN]: "Need items for your journey? Click on Poké Mart to buy essential gear!",
      [JA]: "冒険の道具が必要ですか？フレンドリィショップをクリックして、必要なアイテムを購入しましょう！",
      [ZH]: "旅途中需要道具吗？点击宝可梦商店购买必备装备！",
    },
    market: {
      [EN]: "Welcome to the Poké Mart! Purchase Poké Balls, health potions, and combat accessories here to aid you in your battles and catch challenges.",
      [JA]: "フレンドリィショップへようこそ！ここではモンスターボールやキズぐすり、戦闘用アイテムを購入して、バトルやキャッチチャレンジに役立てることができます。",
      [ZH]: "欢迎来到宝可梦商店！在这里购买精灵球、伤药和战斗配件，协助你在战斗和捕获挑战中取得胜利。",
    },
    tcg: {
      [EN]: "Finally, check out Poke TCG! Browse, collect, and admire beautiful Pokémon Trading Cards here.",
      [JA]: "最後に、ポケモンカード（TCG）をチェックしましょう！美しいカードコレクションを閲覧し、集めて楽しめます。",
      [ZH]: "最后，来看看宝可梦纸牌游戏（TCG）！在这里浏览、收集并欣赏精美的宝可梦集换式卡牌。",
    },
    conclusion: {
      [EN]: "You are now fully trained on how to use the portal. Venture forth, discover new species, and catch 'em all!",
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
        content: getTourTranslation("pokedex", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-nav-pokedex"),
      },
      {
        target: "#tour-nav-mypokemon",
        placement: "bottom",
        content: getTourTranslation("mypokemon", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-nav-mypokemon"),
      },
      {
        target: "#tour-nav-games",
        placement: "bottom",
        content: getTourTranslation("games", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-nav-games"),
      },
      {
        target: "#tour-nav-explore",
        placement: "bottom",
        content: getTourTranslation("explore", languageId),
        route: "/pokemons",
        disableBeacon: true,
        before: ensureRouteAndElement("/pokemons", "#tour-nav-explore"),
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
        target: "#tour-nav-market",
        placement: "bottom",
        content: getTourTranslation("market_nav", languageId),
        route: "/explore/types",
        disableBeacon: true,
        before: ensureRouteAndElement("/explore/types", "#tour-nav-market"),
      },
      {
        target: "#tour-market-sidebar",
        placement: "right",
        content: getTourTranslation("market", languageId),
        route: "/poke-mart",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-mart", "#tour-market-sidebar"),
      },
      {
        target: "#tour-nav-tcg",
        placement: "bottom",
        content: getTourTranslation("tcg", languageId),
        route: "/poke-mart",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-mart", "#tour-nav-tcg"),
      },
      {
        target: "body",
        placement: "center",
        content: getTourTranslation("conclusion", languageId),
        route: "/poke-mart",
        disableBeacon: true,
        before: ensureRouteAndElement("/poke-mart", "body"),
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
