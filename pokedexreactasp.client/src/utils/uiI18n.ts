import { LANGUAGE_IDS, LanguageId } from "../contexts";

/**
 * UI translations for static labels across the application
 * Based on PokeAPI language IDs
 */

// Navigation & Header translations
const UI_TRANSLATIONS: Record<string, Record<number, string>> = {
  // Header titles
  "explore.title": {
    [LANGUAGE_IDS.ENGLISH]: "Explore Pokémon",
    [LANGUAGE_IDS.JAPANESE]: "ポケモンを探す",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 탐색",
    [LANGUAGE_IDS.FRENCH]: "Explorer les Pokémon",
    [LANGUAGE_IDS.GERMAN]: "Pokémon entdecken",
    [LANGUAGE_IDS.SPANISH]: "Explorar Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "Esplora Pokémon",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "探索宝可梦",
  },
  "explore.subtitle": {
    [LANGUAGE_IDS.ENGLISH]: "Challenge & catch them all",
    [LANGUAGE_IDS.JAPANESE]: "挑戦して全部捕まえよう",
    [LANGUAGE_IDS.KOREAN]: "도전하고 모두 잡아보세요",
    [LANGUAGE_IDS.FRENCH]: "Défiez et attrapez-les tous",
    [LANGUAGE_IDS.GERMAN]: "Fordere heraus & fange sie alle",
    [LANGUAGE_IDS.SPANISH]: "Desafía y atrápalos a todos",
    [LANGUAGE_IDS.ITALIAN]: "Sfida e catturali tutti",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "挑战并捕捉它们",
  },

  // Top Navigation items
  "nav.pokedex": {
    [LANGUAGE_IDS.ENGLISH]: "Pokédex",
    [LANGUAGE_IDS.JAPANESE]: "ポケモン図鑑",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 도감",
    [LANGUAGE_IDS.FRENCH]: "Pokédex",
    [LANGUAGE_IDS.GERMAN]: "Pokédex",
    [LANGUAGE_IDS.SPANISH]: "Pokédex",
    [LANGUAGE_IDS.ITALIAN]: "Pokédex",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦图鉴",
  },
  "nav.myPokemon": {
    [LANGUAGE_IDS.ENGLISH]: "My Pokémon",
    [LANGUAGE_IDS.JAPANESE]: "マイポケモン",
    [LANGUAGE_IDS.KOREAN]: "나의 포켓몬",
    [LANGUAGE_IDS.FRENCH]: "Mes Pokémon",
    [LANGUAGE_IDS.GERMAN]: "Meine Pokémon",
    [LANGUAGE_IDS.SPANISH]: "Mis Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "I miei Pokémon",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "我的宝可梦",
  },
  "nav.miniGames": {
    [LANGUAGE_IDS.ENGLISH]: "Mini Games",
    [LANGUAGE_IDS.JAPANESE]: "ミニゲーム",
    [LANGUAGE_IDS.KOREAN]: "미니 게임",
    [LANGUAGE_IDS.FRENCH]: "Mini Jeux",
    [LANGUAGE_IDS.GERMAN]: "Minispiele",
    [LANGUAGE_IDS.SPANISH]: "Minijuegos",
    [LANGUAGE_IDS.ITALIAN]: "Mini Giochi",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "小游戏",
  },
  "nav.explore": {
    [LANGUAGE_IDS.ENGLISH]: "Explore",
    [LANGUAGE_IDS.JAPANESE]: "探索",
    [LANGUAGE_IDS.KOREAN]: "탐험",
    [LANGUAGE_IDS.FRENCH]: "Explorer",
    [LANGUAGE_IDS.GERMAN]: "Entdecken",
    [LANGUAGE_IDS.SPANISH]: "Explorar",
    [LANGUAGE_IDS.ITALIAN]: "Esplora",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "探索",
  },
  "nav.pokeMart": {
    [LANGUAGE_IDS.ENGLISH]: "Poké Mart",
    [LANGUAGE_IDS.JAPANESE]: "フレンドリィショップ",
    [LANGUAGE_IDS.KOREAN]: "프렌들리샵",
    [LANGUAGE_IDS.FRENCH]: "Poké Boutique",
    [LANGUAGE_IDS.GERMAN]: "Poké-Markt",
    [LANGUAGE_IDS.SPANISH]: "Tienda Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "Poké Mart",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦商店",
  },

  // Mini Games dropdown
  "games.combatTeam": {
    [LANGUAGE_IDS.ENGLISH]: "Combat Team",
    [LANGUAGE_IDS.JAPANESE]: "バトルチーム",
    [LANGUAGE_IDS.KOREAN]: "배틀 팀",
    [LANGUAGE_IDS.FRENCH]: "Équipe de Combat",
    [LANGUAGE_IDS.GERMAN]: "Kampfteam",
    [LANGUAGE_IDS.SPANISH]: "Equipo de Combate",
    [LANGUAGE_IDS.ITALIAN]: "Squadra di Combattimento",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "对战队伍",
  },
  "games.whosThatPokemon": {
    [LANGUAGE_IDS.ENGLISH]: "Who's That Pokémon?",
    [LANGUAGE_IDS.JAPANESE]: "だれだ?",
    [LANGUAGE_IDS.KOREAN]: "누구일까요?",
    [LANGUAGE_IDS.FRENCH]: "Qui est ce Pokémon?",
    [LANGUAGE_IDS.GERMAN]: "Welches Pokémon ist das?",
    [LANGUAGE_IDS.SPANISH]: "¿Quién es ese Pokémon?",
    [LANGUAGE_IDS.ITALIAN]: "Chi è quel Pokémon?",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "这是谁？",
  },
  "games.typeMatchup": {
    [LANGUAGE_IDS.ENGLISH]: "Type Matchup Quiz",
    [LANGUAGE_IDS.JAPANESE]: "タイプ相性クイズ",
    [LANGUAGE_IDS.KOREAN]: "타입 상성 퀴즈",
    [LANGUAGE_IDS.FRENCH]: "Quiz Matchup de Type",
    [LANGUAGE_IDS.GERMAN]: "Typ-Matchup-Quiz",
    [LANGUAGE_IDS.SPANISH]: "Quiz de Tipos",
    [LANGUAGE_IDS.ITALIAN]: "Quiz Abbinamento Tipi",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "属性相克测验",
  },
  "games.catchChallenge": {
    [LANGUAGE_IDS.ENGLISH]: "Catch Challenge",
    [LANGUAGE_IDS.JAPANESE]: "捕獲チャレンジ",
    [LANGUAGE_IDS.KOREAN]: "포획 챌린지",
    [LANGUAGE_IDS.FRENCH]: "Défi de Capture",
    [LANGUAGE_IDS.GERMAN]: "Fang-Herausforderung",
    [LANGUAGE_IDS.SPANISH]: "Desafío de Captura",
    [LANGUAGE_IDS.ITALIAN]: "Sfida di Cattura",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "捕获挑战",
  },

  // Explore dropdown
  "explore.regions": {
    [LANGUAGE_IDS.ENGLISH]: "Regions",
    [LANGUAGE_IDS.JAPANESE]: "地方",
    [LANGUAGE_IDS.KOREAN]: "지방",
    [LANGUAGE_IDS.FRENCH]: "Régions",
    [LANGUAGE_IDS.GERMAN]: "Regionen",
    [LANGUAGE_IDS.SPANISH]: "Regiones",
    [LANGUAGE_IDS.ITALIAN]: "Regioni",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "地区",
  },
  "explore.types": {
    [LANGUAGE_IDS.ENGLISH]: "Types",
    [LANGUAGE_IDS.JAPANESE]: "タイプ",
    [LANGUAGE_IDS.KOREAN]: "타입",
    [LANGUAGE_IDS.FRENCH]: "Types",
    [LANGUAGE_IDS.GERMAN]: "Typen",
    [LANGUAGE_IDS.SPANISH]: "Tipos",
    [LANGUAGE_IDS.ITALIAN]: "Tipi",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "属性",
  },
  "explore.generations": {
    [LANGUAGE_IDS.ENGLISH]: "Generations",
    [LANGUAGE_IDS.JAPANESE]: "世代",
    [LANGUAGE_IDS.KOREAN]: "세대",
    [LANGUAGE_IDS.FRENCH]: "Générations",
    [LANGUAGE_IDS.GERMAN]: "Generationen",
    [LANGUAGE_IDS.SPANISH]: "Generaciones",
    [LANGUAGE_IDS.ITALIAN]: "Generazioni",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "世代",
  },

  // User menu
  "user.profile": {
    [LANGUAGE_IDS.ENGLISH]: "Profile",
    [LANGUAGE_IDS.JAPANESE]: "プロフィール",
    [LANGUAGE_IDS.KOREAN]: "프로필",
    [LANGUAGE_IDS.FRENCH]: "Profil",
    [LANGUAGE_IDS.GERMAN]: "Profil",
    [LANGUAGE_IDS.SPANISH]: "Perfil",
    [LANGUAGE_IDS.ITALIAN]: "Profilo",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "个人资料",
  },
  "user.friends": {
    [LANGUAGE_IDS.ENGLISH]: "Friends",
    [LANGUAGE_IDS.JAPANESE]: "フレンド",
    [LANGUAGE_IDS.KOREAN]: "친구",
    [LANGUAGE_IDS.FRENCH]: "Amis",
    [LANGUAGE_IDS.GERMAN]: "Freunde",
    [LANGUAGE_IDS.SPANISH]: "Amigos",
    [LANGUAGE_IDS.ITALIAN]: "Amici",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "好友",
  },
  "user.settings": {
    [LANGUAGE_IDS.ENGLISH]: "Settings",
    [LANGUAGE_IDS.JAPANESE]: "設定",
    [LANGUAGE_IDS.KOREAN]: "설정",
    [LANGUAGE_IDS.FRENCH]: "Paramètres",
    [LANGUAGE_IDS.GERMAN]: "Einstellungen",
    [LANGUAGE_IDS.SPANISH]: "Ajustes",
    [LANGUAGE_IDS.ITALIAN]: "Impostazioni",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "设置",
  },
  "user.logout": {
    [LANGUAGE_IDS.ENGLISH]: "Logout",
    [LANGUAGE_IDS.JAPANESE]: "ログアウト",
    [LANGUAGE_IDS.KOREAN]: "로그아웃",
    [LANGUAGE_IDS.FRENCH]: "Déconnexion",
    [LANGUAGE_IDS.GERMAN]: "Abmelden",
    [LANGUAGE_IDS.SPANISH]: "Cerrar Sesión",
    [LANGUAGE_IDS.ITALIAN]: "Esci",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "登出",
  },
  "user.login": {
    [LANGUAGE_IDS.ENGLISH]: "Login",
    [LANGUAGE_IDS.JAPANESE]: "ログイン",
    [LANGUAGE_IDS.KOREAN]: "로그인",
    [LANGUAGE_IDS.FRENCH]: "Connexion",
    [LANGUAGE_IDS.GERMAN]: "Anmelden",
    [LANGUAGE_IDS.SPANISH]: "Iniciar Sesión",
    [LANGUAGE_IDS.ITALIAN]: "Accedi",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "登录",
  },

  // Search
  "search.placeholder": {
    [LANGUAGE_IDS.ENGLISH]: "Search Pokémon...",
    [LANGUAGE_IDS.JAPANESE]: "ポケモンを検索...",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 검색...",
    [LANGUAGE_IDS.FRENCH]: "Rechercher Pokémon...",
    [LANGUAGE_IDS.GERMAN]: "Pokémon suchen...",
    [LANGUAGE_IDS.SPANISH]: "Buscar Pokémon...",
    [LANGUAGE_IDS.ITALIAN]: "Cerca Pokémon...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "搜索宝可梦...",
  },

  // Back button
  "common.back": {
    [LANGUAGE_IDS.ENGLISH]: "Back",
    [LANGUAGE_IDS.JAPANESE]: "戻る",
    [LANGUAGE_IDS.KOREAN]: "뒤로",
    [LANGUAGE_IDS.FRENCH]: "Retour",
    [LANGUAGE_IDS.GERMAN]: "Zurück",
    [LANGUAGE_IDS.SPANISH]: "Volver",
    [LANGUAGE_IDS.ITALIAN]: "Indietro",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "返回",
  },

  // End message for infinite scroll
  "explore.endMessage": {
    [LANGUAGE_IDS.ENGLISH]:
      "You've caught them all! No more Pokémon to display.",
    [LANGUAGE_IDS.JAPANESE]: "全部捕まえた！もうポケモンはいません。",
    [LANGUAGE_IDS.KOREAN]: "모두 잡았습니다! 더 이상 포켓몬이 없습니다.",
    [LANGUAGE_IDS.FRENCH]:
      "Vous les avez tous attrapés! Plus de Pokémon à afficher.",
    [LANGUAGE_IDS.GERMAN]:
      "Du hast sie alle gefangen! Keine weiteren Pokémon anzuzeigen.",
    [LANGUAGE_IDS.SPANISH]:
      "¡Los has atrapado a todos! No hay más Pokémon para mostrar.",
    [LANGUAGE_IDS.ITALIAN]:
      "Li hai catturati tutti! Nessun altro Pokémon da mostrare.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "全部捕获！没有更多的宝可梦了。",
  },

  // Error messages
  "error.loadPokemon": {
    [LANGUAGE_IDS.ENGLISH]: "Oops! Failed to get Pokémon. Please try again!",
    [LANGUAGE_IDS.JAPANESE]:
      "おっと！ポケモンの取得に失敗しました。もう一度お試しください！",
    [LANGUAGE_IDS.KOREAN]:
      "이런! 포켓몬을 가져오지 못했습니다. 다시 시도해 주세요!",
    [LANGUAGE_IDS.FRENCH]:
      "Oups! Échec du chargement des Pokémon. Veuillez réessayer!",
    [LANGUAGE_IDS.GERMAN]:
      "Ups! Pokémon konnten nicht geladen werden. Bitte versuche es erneut!",
    [LANGUAGE_IDS.SPANISH]:
      "¡Ups! Error al cargar Pokémon. ¡Por favor, inténtalo de nuevo!",
    [LANGUAGE_IDS.ITALIAN]:
      "Ops! Impossibile caricare i Pokémon. Riprova per favore!",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "哎呀！获取宝可梦失败。请重试！",
  },
};

/**
 * Get localized UI text
 * @param key - Translation key (e.g., 'nav.pokedex', 'user.login')
 * @param languageId - Language ID from context
 * @returns Localized text, falls back to English if not found
 */
export function t(key: string, languageId: LanguageId): string {
  const translations = UI_TRANSLATIONS[key];

  if (!translations) {
    // Unknown key, return the key itself as fallback
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }

  return translations[languageId] || translations[LANGUAGE_IDS.ENGLISH] || key;
}

/**
 * Hook-friendly version that returns a translator function
 * Usage: const { t } = useUITranslation(languageId);
 */
export function createTranslator(languageId: LanguageId) {
  return (key: string) => t(key, languageId);
}

export default UI_TRANSLATIONS;
