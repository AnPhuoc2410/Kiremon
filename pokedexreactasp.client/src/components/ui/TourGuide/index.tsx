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
    nav: {
      [EN]: "This is the Explore Menu! Here you can check out different Regions, Types, and Generations. Let's go ahead and view the Regions page!",
      [JA]: "こちらは探索メニューです！ここでは、様々な地方、タイプ、世代を調べることができます。さあ、地方のページへ行ってみましょう！",
      [ZH]: "这是探索菜单！在这里你可以查看不同的地区、属性和世代。让我们继续前往地区页面！",
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
    market: {
      [EN]: "Welcome to the Poké Mart! Need gear? You can purchase Poké Balls, health potions, and combat accessories here for your next challenge.",
      [JA]: "フレンドリィショップへようこそ！道具が必要ですか？ここではモンスターボールやキズぐすり、戦闘用アイテムを購入できます。",
      [ZH]: "欢迎来到宝可梦商店！需要装备吗？你可以在这里购买精灵球、伤药和战斗配件，为下一次挑战做准备。",
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
  const [stepIndex, setStepIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  // Step definitions mapped to DOM selectors and paths
  const steps = useMemo<(Step & { route?: string })[]>(
    () => [
      {
        target: "body",
        placement: "center",
        content: getTourTranslation("welcome", languageId),
        route: "/pokemons",
      },
      {
        target: "#tour-nav-explore",
        placement: "bottom",
        content: getTourTranslation("nav", languageId),
        route: "/pokemons",
      },
      {
        target: "#tour-regions-grid",
        placement: "top",
        content: getTourTranslation("regions", languageId),
        route: "/explore/regions",
      },
      {
        target: "#tour-types-grid",
        placement: "top",
        content: getTourTranslation("types", languageId),
        route: "/explore/types",
      },
      {
        target: "#tour-market-sidebar",
        placement: "right",
        content: getTourTranslation("market", languageId),
        route: "/poke-mart",
      },
      {
        target: "body",
        placement: "center",
        content: getTourTranslation("conclusion", languageId),
        route: "/poke-mart",
      },
    ],
    [languageId],
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

  // Handle cross-page transitions
  useEffect(() => {
    if (pendingIndex !== null) {
      const targetStep = steps[pendingIndex];
      if (targetStep && location.pathname === targetStep.route) {
        const timer = setTimeout(() => {
          setStepIndex(pendingIndex);
          setPendingIndex(null);
          setRun(true);
        }, 500); // Allow 500ms for components and DOM selectors to be loaded
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, pendingIndex, steps]);

  // Safety check: if the user manually navigates to a different page while the tour is running,
  // we stop the tour to avoid locking the overlay.
  useEffect(() => {
    if (run && pendingIndex === null) {
      const currentStep = steps[stepIndex];
      if (
        currentStep &&
        currentStep.route &&
        location.pathname !== currentStep.route
      ) {
        setRun(false);
        setStepIndex(0);
      }
    }
  }, [location.pathname, run, stepIndex, pendingIndex, steps]);

  const handleJoyrideCallback = (data: EventData) => {
    const { action, index, status, type } = data;

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem("hasCompletedTour", "true");
    } else if (type === EVENTS.STEP_AFTER) {
      const nextIndex = action === ACTIONS.PREV ? index - 1 : index + 1;
      const nextStep = steps[nextIndex];

      if (nextStep) {
        const currentRoute = location.pathname;
        const targetRoute = nextStep.route;

        if (targetRoute && currentRoute !== targetRoute) {
          // Pause tour, store pending index, and trigger navigation
          setRun(false);
          setPendingIndex(nextIndex);
          navigate(targetRoute);
        } else {
          setStepIndex(nextIndex);
        }
      }
    }
  };

  const handleStartTour = () => {
    localStorage.removeItem("hasCompletedTour");
    if (location.pathname !== "/pokemons") {
      navigate("/pokemons");
      setPendingIndex(0);
    } else {
      setStepIndex(0);
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
    return (
      <S.TooltipWrapper {...tooltipProps}>
        <S.DialogueBubble>
          <S.SpeakerTitle>Prof. Oak</S.SpeakerTitle>
          <S.DialogueText>{step.content}</S.DialogueText>
          <S.DialogueFooter>
            <S.SkipButton
              {...skipProps}
              onClick={(e) => {
                setRun(false);
                setStepIndex(0);
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
                <S.RetroButton variant="secondary" {...backProps}>
                  {getTourTranslation("back", languageId)}
                </S.RetroButton>
              )}
              <S.RetroButton
                variant="primary"
                {...primaryProps}
                onClick={(e) => {
                  if (isLastStep) {
                    setRun(false);
                    setStepIndex(0);
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
          {!isLastStep && <S.NextIndicator />}
        </S.DialogueBubble>

        {/* Diagonal speech bubble tail pointing to the avatar */}
        <S.BubbleTailContainer>
          <svg
            width="40"
            height="28"
            viewBox="0 0 40 28"
            fill="none"
            style={{ display: "block" }}
          >
            {/* Outer border of tail (black) */}
            <path d="M 15 0 L 5 28 L 35 0 Z" fill="#212529" />
            {/* Inner fill of tail (white) */}
            <path d="M 18 0 L 8 24 L 32 0 Z" fill="#ffffff" />
          </svg>
        </S.BubbleTailContainer>

        {/* Professor Oak Avatar Row */}
        <S.AvatarRow>
          <S.AvatarContainer>
            <img src="/images/professor_guide.png" alt="Professor Oak" />
          </S.AvatarContainer>
        </S.AvatarRow>
      </S.TooltipWrapper>
    );
  };

  return (
    <>
      {run && (
        <Joyride
          steps={steps}
          run={run}
          stepIndex={stepIndex}
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
      )}
    </>
  );
};

export default TourGuide;
