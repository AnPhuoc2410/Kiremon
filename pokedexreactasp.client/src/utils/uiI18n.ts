import { LANGUAGE_IDS, LanguageId } from "@/contexts";

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
  "nav.bag": {
    [LANGUAGE_IDS.ENGLISH]: "Bag",
    [LANGUAGE_IDS.JAPANESE]: "バッグ",
    [LANGUAGE_IDS.KOREAN]: "가방",
    [LANGUAGE_IDS.FRENCH]: "Sac",
    [LANGUAGE_IDS.GERMAN]: "Beutel",
    [LANGUAGE_IDS.SPANISH]: "Mochila",
    [LANGUAGE_IDS.ITALIAN]: "Zaino",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "背包",
  },
  "nav.pokeTcg": {
    [LANGUAGE_IDS.ENGLISH]: "Poké TCG",
    [LANGUAGE_IDS.JAPANESE]: "ポケモンカードゲーム",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 카드 게임",
    [LANGUAGE_IDS.FRENCH]: "Poké TCG",
    [LANGUAGE_IDS.GERMAN]: "Poké TCG",
    [LANGUAGE_IDS.SPANISH]: "Poké TCG",
    [LANGUAGE_IDS.ITALIAN]: "Poké TCG",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦卡牌游戏",
  },
  "nav.wildArea": {
    [LANGUAGE_IDS.ENGLISH]: "Wild Area",
    [LANGUAGE_IDS.JAPANESE]: "ワイルドエリア",
    [LANGUAGE_IDS.KOREAN]: "와일드에어리어",
    [LANGUAGE_IDS.FRENCH]: "Terres Sauvages",
    [LANGUAGE_IDS.GERMAN]: "Naturzone",
    [LANGUAGE_IDS.SPANISH]: "Área Silvestre",
    [LANGUAGE_IDS.ITALIAN]: "Terre Selvagge",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "旷野地带",
  },
  "nav.pokeNews": {
    [LANGUAGE_IDS.ENGLISH]: "Poke News",
    [LANGUAGE_IDS.JAPANESE]: "ポケモンニュース",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 뉴스",
    [LANGUAGE_IDS.FRENCH]: "Actus Pokémon",
    [LANGUAGE_IDS.GERMAN]: "Pokémon-News",
    [LANGUAGE_IDS.SPANISH]: "Noticias Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "Notizie Pokémon",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦新闻",
  },
  "tcg.title": {
    [LANGUAGE_IDS.ENGLISH]: "Poké TCG Cards",
    [LANGUAGE_IDS.JAPANESE]: "ポケカ",
    [LANGUAGE_IDS.KOREAN]: "포카",
    [LANGUAGE_IDS.FRENCH]: "Poké TCG Cartes",
    [LANGUAGE_IDS.GERMAN]: "Poké TCG Karten",
    [LANGUAGE_IDS.SPANISH]: "Poké TCG Cartas",
    [LANGUAGE_IDS.ITALIAN]: "Poké TCG Carte",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦卡牌",
  },
  "tcg.subtitle": {
    [LANGUAGE_IDS.ENGLISH]: "Collection Cards - Collect Them All",
    [LANGUAGE_IDS.JAPANESE]: "コレクションカード - すべてを集めよう",
    [LANGUAGE_IDS.KOREAN]: "컬렉션 카드 - 모두 모으세요",
    [LANGUAGE_IDS.FRENCH]: "Collection de Cartes - Collectionnez-les toutes",
    [LANGUAGE_IDS.GERMAN]: "Kartensammlung - Sammle sie alle",
    [LANGUAGE_IDS.SPANISH]: "Colección de Cartas - Colecciónalas Todas",
    [LANGUAGE_IDS.ITALIAN]: "Collezione di Carte - Collezionarle Tutte",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "卡牌收集 - 收集所有卡牌",
  },
  "news.title": {
    [LANGUAGE_IDS.ENGLISH]: "Pokémon News",
    [LANGUAGE_IDS.JAPANESE]: "ポケモンニュース",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 뉴스",
    [LANGUAGE_IDS.FRENCH]: "Actualités Pokémon",
    [LANGUAGE_IDS.GERMAN]: "Pokémon-News",
    [LANGUAGE_IDS.SPANISH]: "Noticias Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "Notizie Pokémon",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦新闻",
  },
  "news.subtitle": {
    [LANGUAGE_IDS.ENGLISH]:
      "Latest updates and articles from the Pokémon world",
    [LANGUAGE_IDS.JAPANESE]: "ポケモン界の最新情報と記事",
    [LANGUAGE_IDS.KOREAN]: "포켓몬 세계의 최신 소식과 기사",
    [LANGUAGE_IDS.FRENCH]:
      "Dernières mises à jour et articles du monde Pokémon",
    [LANGUAGE_IDS.GERMAN]: "Aktuelle Updates und Artikel aus der Pokémon-Welt",
    [LANGUAGE_IDS.SPANISH]:
      "Últimas actualizaciones y artículos del mundo Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "Ultimi aggiornamenti e articoli dal mondo Pokémon",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦世界的最新动态与文章",
  },
  "news.sync": {
    [LANGUAGE_IDS.ENGLISH]: "Sync News",
    [LANGUAGE_IDS.JAPANESE]: "ニュース同期",
    [LANGUAGE_IDS.KOREAN]: "뉴스 동기화",
    [LANGUAGE_IDS.FRENCH]: "Sync Actus",
    [LANGUAGE_IDS.GERMAN]: "News synchronisieren",
    [LANGUAGE_IDS.SPANISH]: "Sincronizar Noticias",
    [LANGUAGE_IDS.ITALIAN]: "Sincronizza Notizie",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "同步新闻",
  },
  "news.syncing": {
    [LANGUAGE_IDS.ENGLISH]: "Syncing...",
    [LANGUAGE_IDS.JAPANESE]: "同期中...",
    [LANGUAGE_IDS.KOREAN]: "동기화 중...",
    [LANGUAGE_IDS.FRENCH]: "Synchronisation...",
    [LANGUAGE_IDS.GERMAN]: "Synchronisiere...",
    [LANGUAGE_IDS.SPANISH]: "Sincronizando...",
    [LANGUAGE_IDS.ITALIAN]: "Sincronizzazione...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "同步中...",
  },
  "news.syncSuccess": {
    [LANGUAGE_IDS.ENGLISH]: "Synchronized successfully!",
    [LANGUAGE_IDS.JAPANESE]: "同期が成功しました！",
    [LANGUAGE_IDS.KOREAN]: "동기화에 성공했습니다!",
    [LANGUAGE_IDS.FRENCH]: "Synchronisé avec succès!",
    [LANGUAGE_IDS.GERMAN]: "Erfolgreich synchronisiert!",
    [LANGUAGE_IDS.SPANISH]: "¡Sincronizado con éxito!",
    [LANGUAGE_IDS.ITALIAN]: "Sincronizzato con successo!",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "同步成功！",
  },
  "news.syncFailed": {
    [LANGUAGE_IDS.ENGLISH]: "Failed to sync. Please try again.",
    [LANGUAGE_IDS.JAPANESE]: "同期に失敗しました。もう一度お試しください。",
    [LANGUAGE_IDS.KOREAN]: "동기화에 실패했습니다. 다시 시도해 주세요.",
    [LANGUAGE_IDS.FRENCH]: "Échec de synchronisation. Veuillez réessayer.",
    [LANGUAGE_IDS.GERMAN]:
      "Fehler beim Synchronisieren. Bitte erneut versuchen.",
    [LANGUAGE_IDS.SPANISH]: "Error al sincronizar. Inténtalo de nuevo.",
    [LANGUAGE_IDS.ITALIAN]: "Sincronizzazione fallita. Riprova.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "同步失败。请重试。",
  },
  "news.searchPlaceholder": {
    [LANGUAGE_IDS.ENGLISH]: "Search news articles...",
    [LANGUAGE_IDS.JAPANESE]: "記事を検索...",
    [LANGUAGE_IDS.KOREAN]: "기사 검색...",
    [LANGUAGE_IDS.FRENCH]: "Rechercher des articles...",
    [LANGUAGE_IDS.GERMAN]: "News-Artikel suchen...",
    [LANGUAGE_IDS.SPANISH]: "Buscar artículos...",
    [LANGUAGE_IDS.ITALIAN]: "Cerca articoli...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "搜索新闻文章...",
  },
  "news.noNews": {
    [LANGUAGE_IDS.ENGLISH]: "No news articles found.",
    [LANGUAGE_IDS.JAPANESE]: "記事が見つかりません。",
    [LANGUAGE_IDS.KOREAN]: "뉴스 기사가 없습니다.",
    [LANGUAGE_IDS.FRENCH]: "Aucun article trouvé.",
    [LANGUAGE_IDS.GERMAN]: "Keine News-Artikel gefunden.",
    [LANGUAGE_IDS.SPANISH]: "No se encontraron artículos.",
    [LANGUAGE_IDS.ITALIAN]: "Nessun articolo trovato.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "未找到新闻文章。",
  },
  "news.readMore": {
    [LANGUAGE_IDS.ENGLISH]: "Read Source",
    [LANGUAGE_IDS.JAPANESE]: "ソースを読む",
    [LANGUAGE_IDS.KOREAN]: "출처 보기",
    [LANGUAGE_IDS.FRENCH]: "Lire la Source",
    [LANGUAGE_IDS.GERMAN]: "Quelle lesen",
    [LANGUAGE_IDS.SPANISH]: "Leer Fuente",
    [LANGUAGE_IDS.ITALIAN]: "Leggi la Fonte",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "阅读源",
  },
  "news.views": {
    [LANGUAGE_IDS.ENGLISH]: "views",
    [LANGUAGE_IDS.JAPANESE]: "閲覧数",
    [LANGUAGE_IDS.KOREAN]: "조회수",
    [LANGUAGE_IDS.FRENCH]: "vues",
    [LANGUAGE_IDS.GERMAN]: "Aufrufe",
    [LANGUAGE_IDS.SPANISH]: "vistas",
    [LANGUAGE_IDS.ITALIAN]: "visualizzazioni",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "浏览量",
  },
  "news.publishedBy": {
    [LANGUAGE_IDS.ENGLISH]: "Published by",
    [LANGUAGE_IDS.JAPANESE]: "投稿者",
    [LANGUAGE_IDS.KOREAN]: "게시자",
    [LANGUAGE_IDS.FRENCH]: "Publié par",
    [LANGUAGE_IDS.GERMAN]: "Veröffentlicht von",
    [LANGUAGE_IDS.SPANISH]: "Publicado por",
    [LANGUAGE_IDS.ITALIAN]: "Pubblicato da",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "发布者",
  },
  "news.categoryAll": {
    [LANGUAGE_IDS.ENGLISH]: "All",
    [LANGUAGE_IDS.JAPANESE]: "すべて",
    [LANGUAGE_IDS.KOREAN]: "전체",
    [LANGUAGE_IDS.FRENCH]: "Tout",
    [LANGUAGE_IDS.GERMAN]: "Alle",
    [LANGUAGE_IDS.SPANISH]: "Todo",
    [LANGUAGE_IDS.ITALIAN]: "Tutti",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "全部",
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
  "games.statOptimizer": {
    [LANGUAGE_IDS.ENGLISH]: "Stat Optimizer",
    [LANGUAGE_IDS.JAPANESE]: "ステータス最適化",
    [LANGUAGE_IDS.KOREAN]: "스탯 최적화",
    [LANGUAGE_IDS.FRENCH]: "Optimiseur de Statistiques",
    [LANGUAGE_IDS.GERMAN]: "Statistik-Optimierer",
    [LANGUAGE_IDS.SPANISH]: "Optimizador de Estadísticas",
    [LANGUAGE_IDS.ITALIAN]: "Ottimizzatore Statistiche",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "属性优化",
  },
  "games.statOptimizer.howToPlay": {
    [LANGUAGE_IDS.ENGLISH]: "How to Play",
    [LANGUAGE_IDS.JAPANESE]: "遊び方",
    [LANGUAGE_IDS.KOREAN]: "게임 방법",
    [LANGUAGE_IDS.FRENCH]: "Comment Jouer",
    [LANGUAGE_IDS.GERMAN]: "Spielanleitung",
    [LANGUAGE_IDS.SPANISH]: "Cómo Jugar",
    [LANGUAGE_IDS.ITALIAN]: "Come Giocare",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "怎么玩",
  },
  "games.statOptimizer.howToPlayDesc": {
    [LANGUAGE_IDS.ENGLISH]:
      "You are given 6 random Pokémon. Assign exactly one unique stat (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed) to each Pokémon.",
    [LANGUAGE_IDS.JAPANESE]:
      "6匹のランダムなポケモンが与えられます。それぞれのポケモンに重複しないステータスを1つずつ割り当ててください。",
    [LANGUAGE_IDS.KOREAN]:
      "무작위로 6마리의 포켓몬이 주어집니다. 각 포켓몬에게 고유한 스탯을 하나씩 할당하세요.",
    [LANGUAGE_IDS.FRENCH]:
      "Vous recevez 6 Pokémon aléatoires. Attribuez une statistique unique à chaque Pokémon.",
    [LANGUAGE_IDS.GERMAN]:
      "Ihnen werden 6 zufällige Pokémon gegeben. Weisen Sie jedem Pokémon einen eindeutigen Statuswert zu.",
    [LANGUAGE_IDS.SPANISH]:
      "Se te dan 6 Pokémon aleatorios. Asigna una estadística única a cada Pokémon.",
    [LANGUAGE_IDS.ITALIAN]:
      "Ti vengono dati 6 Pokémon casuali. Assegna una statistica unica a ciascun Pokémon.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]:
      "您将获得6只随机宝可梦。请为每只宝可梦分配一项独特的属性。",
  },
  "games.statOptimizer.howToWin": {
    [LANGUAGE_IDS.ENGLISH]: "How to Win",
    [LANGUAGE_IDS.JAPANESE]: "勝つためには",
    [LANGUAGE_IDS.KOREAN]: "승리 방법",
    [LANGUAGE_IDS.FRENCH]: "Comment Gagner",
    [LANGUAGE_IDS.GERMAN]: "Wie man gewinnt",
    [LANGUAGE_IDS.SPANISH]: "Cómo Ganar",
    [LANGUAGE_IDS.ITALIAN]: "Come Vincere",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "如何获胜",
  },
  "games.statOptimizer.howToWinDesc": {
    [LANGUAGE_IDS.ENGLISH]:
      "The goal is to maximize the total sum of the assigned stats. Find the optimal combination that yields the highest possible score to get a perfect score!",
    [LANGUAGE_IDS.JAPANESE]:
      "割り当てられたステータスの合計値を最大化することが目標です。最高得点を出す最適な組み合わせを見つけてください！",
    [LANGUAGE_IDS.KOREAN]:
      "할당된 스탯의 총합을 최대화하는 것이 목표입니다. 가장 높은 점수를 얻을 수 있는 최적의 조합을 찾으세요!",
    [LANGUAGE_IDS.FRENCH]:
      "Le but est de maximiser la somme totale des statistiques attribuées. Trouvez la combinaison optimale pour obtenir le score parfait !",
    [LANGUAGE_IDS.GERMAN]:
      "Das Ziel ist es, die Gesamtsumme der zugewiesenen Statuswerte zu maximieren. Finden Sie die optimale Kombination für die höchste Punktzahl!",
    [LANGUAGE_IDS.SPANISH]:
      "El objetivo es maximizar la suma total de las estadísticas asignadas. ¡Encuentra la combinación óptima que dé la mayor puntuación posible!",
    [LANGUAGE_IDS.ITALIAN]:
      "L'obiettivo è massimizzare la somma totale delle statistiche assegnate. Trova la combinazione ottimale per ottenere il punteggio perfetto!",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]:
      "目标是最大化分配属性的总和。找到能够产生最高可能得分的最佳组合，即可获得满分！",
  },
  "games.pokedle": {
    [LANGUAGE_IDS.ENGLISH]: "Pokedle",
    [LANGUAGE_IDS.JAPANESE]: "Pokedle",
    [LANGUAGE_IDS.KOREAN]: "Pokedle",
    [LANGUAGE_IDS.FRENCH]: "Pokedle",
    [LANGUAGE_IDS.GERMAN]: "Pokedle",
    [LANGUAGE_IDS.SPANISH]: "Pokedle",
    [LANGUAGE_IDS.ITALIAN]: "Pokedle",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "Pokedle",
  },
  "games.pokedle.howToPlay": {
    [LANGUAGE_IDS.ENGLISH]: "How to Play",
    [LANGUAGE_IDS.JAPANESE]: "遊び方",
    [LANGUAGE_IDS.KOREAN]: "게임 방법",
    [LANGUAGE_IDS.FRENCH]: "Comment Jouer",
    [LANGUAGE_IDS.GERMAN]: "Spielanleitung",
    [LANGUAGE_IDS.SPANISH]: "Cómo Jugar",
    [LANGUAGE_IDS.ITALIAN]: "Come Giocare",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "怎么玩",
  },
  "games.pokedle.howToPlayDesc": {
    [LANGUAGE_IDS.ENGLISH]:
      "Guess the Pokémon based on clues. Green means correct, Red means incorrect. Up/Down arrows mean higher or lower.",
    [LANGUAGE_IDS.JAPANESE]:
      "ヒントをもとにポケモンを推測します。緑は正解、赤は不正解です。上下の矢印はそれより高いか低いかを示します。",
    [LANGUAGE_IDS.KOREAN]:
      "힌트를 기반으로 포켓몬을 추측하세요. 초록색은 정답, 빨간색은 오답입니다. 위/아래 화살표는 더 높거나 낮음을 의미합니다.",
    [LANGUAGE_IDS.FRENCH]:
      "Devinez le Pokémon en fonction des indices. Vert signifie correct, rouge signifie incorrect. Les flèches haut/bas signifient plus haut ou plus bas.",
    [LANGUAGE_IDS.GERMAN]:
      "Errate das Pokémon anhand von Hinweisen. Grün bedeutet richtig, Rot bedeutet falsch. Auf-/Ab-Pfeile bedeuten höher oder niedriger.",
    [LANGUAGE_IDS.SPANISH]:
      "Adivina el Pokémon basándote en las pistas. Verde significa correcto, rojo significa incorrecto. Las flechas arriba/abajo significan mayor o menor.",
    [LANGUAGE_IDS.ITALIAN]:
      "Indovina il Pokémon in base agli indizi. Verde significa corretto, rosso significa errato. Le frecce su/giù indicano maggiore o minore.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]:
      "根据线索猜测宝可梦。绿色表示正确，红色表示错误。上下箭头表示更高或更低。",
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

  // Guide button
  "common.guide": {
    [LANGUAGE_IDS.ENGLISH]: "Guide Book",
    [LANGUAGE_IDS.JAPANESE]: "ガイドブック",
    [LANGUAGE_IDS.KOREAN]: "가이드북",
    [LANGUAGE_IDS.FRENCH]: "Livre Guide",
    [LANGUAGE_IDS.GERMAN]: "Anleitung",
    [LANGUAGE_IDS.SPANISH]: "Libro de Guía",
    [LANGUAGE_IDS.ITALIAN]: "Guida",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "指南手册",
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

  // Poké Mart
  "market.title": {
    [LANGUAGE_IDS.ENGLISH]: "Poké Mart",
    [LANGUAGE_IDS.JAPANESE]: "フレンドリィショップ",
    [LANGUAGE_IDS.KOREAN]: "프렌들리샵",
    [LANGUAGE_IDS.FRENCH]: "Poké Boutique",
    [LANGUAGE_IDS.GERMAN]: "Poké-Markt",
    [LANGUAGE_IDS.SPANISH]: "Tienda Pokémon",
    [LANGUAGE_IDS.ITALIAN]: "Poké Mart",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "宝可梦商店",
  },
  "market.subtitle": {
    [LANGUAGE_IDS.ENGLISH]: "Stock up on items for your journey",
    [LANGUAGE_IDS.JAPANESE]: "冒険に必要なアイテムを揃えよう",
    [LANGUAGE_IDS.KOREAN]: "여행에 필요한 아이템을 준비하세요",
    [LANGUAGE_IDS.FRENCH]: "Faites le plein d'objets pour votre voyage",
    [LANGUAGE_IDS.GERMAN]: "Decke dich mit Items für deine Reise ein",
    [LANGUAGE_IDS.SPANISH]: "Abastécete de objetos para tu viaje",
    [LANGUAGE_IDS.ITALIAN]: "Fai scorta di strumenti per il tuo viaggio",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "为你的旅程准备道具",
  },
  "market.categories": {
    [LANGUAGE_IDS.ENGLISH]: "Categories",
    [LANGUAGE_IDS.JAPANESE]: "カテゴリー",
    [LANGUAGE_IDS.KOREAN]: "카테고리",
    [LANGUAGE_IDS.FRENCH]: "Catégories",
    [LANGUAGE_IDS.GERMAN]: "Kategorien",
    [LANGUAGE_IDS.SPANISH]: "Categorías",
    [LANGUAGE_IDS.ITALIAN]: "Categorie",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "分类",
  },
  "market.clickItem": {
    [LANGUAGE_IDS.ENGLISH]: "Click an item to see details",
    [LANGUAGE_IDS.JAPANESE]: "アイテムをクリックして詳細を見る",
    [LANGUAGE_IDS.KOREAN]: "아이템을 클릭하여 상세 정보 보기",
    [LANGUAGE_IDS.FRENCH]: "Cliquez sur un objet pour voir les détails",
    [LANGUAGE_IDS.GERMAN]: "Klicke auf ein Item für Details",
    [LANGUAGE_IDS.SPANISH]: "Haz clic en un objeto para ver detalles",
    [LANGUAGE_IDS.ITALIAN]: "Clicca su un oggetto per vedere i dettagli",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "点击物品查看详情",
  },
  "market.price": {
    [LANGUAGE_IDS.ENGLISH]: "Price",
    [LANGUAGE_IDS.JAPANESE]: "価格",
    [LANGUAGE_IDS.KOREAN]: "가격",
    [LANGUAGE_IDS.FRENCH]: "Prix",
    [LANGUAGE_IDS.GERMAN]: "Preis",
    [LANGUAGE_IDS.SPANISH]: "Precio",
    [LANGUAGE_IDS.ITALIAN]: "Prezzo",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "价格",
  },
  "market.buy": {
    [LANGUAGE_IDS.ENGLISH]: "Buy",
    [LANGUAGE_IDS.JAPANESE]: "購入",
    [LANGUAGE_IDS.KOREAN]: "구매",
    [LANGUAGE_IDS.FRENCH]: "Acheter",
    [LANGUAGE_IDS.GERMAN]: "Kaufen",
    [LANGUAGE_IDS.SPANISH]: "Comprar",
    [LANGUAGE_IDS.ITALIAN]: "Compra",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "购买",
  },
  "market.buying": {
    [LANGUAGE_IDS.ENGLISH]: "Buying...",
    [LANGUAGE_IDS.JAPANESE]: "購入中...",
    [LANGUAGE_IDS.KOREAN]: "구매 중...",
    [LANGUAGE_IDS.FRENCH]: "Achat...",
    [LANGUAGE_IDS.GERMAN]: "Kaufen...",
    [LANGUAGE_IDS.SPANISH]: "Comprando...",
    [LANGUAGE_IDS.ITALIAN]: "Acquisto...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "购买中...",
  },
  "market.remaining": {
    [LANGUAGE_IDS.ENGLISH]: "remaining",
    [LANGUAGE_IDS.JAPANESE]: "残り",
    [LANGUAGE_IDS.KOREAN]: "남음",
    [LANGUAGE_IDS.FRENCH]: "restant",
    [LANGUAGE_IDS.GERMAN]: "übrig",
    [LANGUAGE_IDS.SPANISH]: "restante",
    [LANGUAGE_IDS.ITALIAN]: "rimanenti",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "剩余",
  },
  "market.loginToBuy": {
    [LANGUAGE_IDS.ENGLISH]: "Please log in to buy items.",
    [LANGUAGE_IDS.JAPANESE]: "アイテムを購入するにはログインしてください。",
    [LANGUAGE_IDS.KOREAN]: "아이템을 구매하려면 로그인하세요.",
    [LANGUAGE_IDS.FRENCH]: "Connectez-vous pour acheter des objets.",
    [LANGUAGE_IDS.GERMAN]: "Bitte melde dich an, um Items zu kaufen.",
    [LANGUAGE_IDS.SPANISH]: "Inicia sesión para comprar objetos.",
    [LANGUAGE_IDS.ITALIAN]: "Accedi per acquistare oggetti.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "请登录后购买物品。",
  },
  "market.buyFailed": {
    [LANGUAGE_IDS.ENGLISH]: "Purchase failed. Please try again.",
    [LANGUAGE_IDS.JAPANESE]: "購入に失敗しました。もう一度お試しください。",
    [LANGUAGE_IDS.KOREAN]: "구매에 실패했습니다. 다시 시도하세요.",
    [LANGUAGE_IDS.FRENCH]: "Échec de l'achat. Veuillez réessayer.",
    [LANGUAGE_IDS.GERMAN]: "Kauf fehlgeschlagen. Bitte erneut versuchen.",
    [LANGUAGE_IDS.SPANISH]: "Error en la compra. Inténtalo de nuevo.",
    [LANGUAGE_IDS.ITALIAN]: "Acquisto non riuscito. Riprova.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "购买失败，请重试。",
  },
  "market.wildPokemon": {
    [LANGUAGE_IDS.ENGLISH]: "Wild Pokémon",
    [LANGUAGE_IDS.JAPANESE]: "野生のポケモン",
    [LANGUAGE_IDS.KOREAN]: "야생 포켓몬",
    [LANGUAGE_IDS.FRENCH]: "Pokémon sauvages",
    [LANGUAGE_IDS.GERMAN]: "Wilde Pokémon",
    [LANGUAGE_IDS.SPANISH]: "Pokémon salvajes",
    [LANGUAGE_IDS.ITALIAN]: "Pokémon selvatici",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "野生宝可梦",
  },
  "market.noDescription": {
    [LANGUAGE_IDS.ENGLISH]: "No description available.",
    [LANGUAGE_IDS.JAPANESE]: "説明がありません。",
    [LANGUAGE_IDS.KOREAN]: "설명이 없습니다.",
    [LANGUAGE_IDS.FRENCH]: "Aucune description disponible.",
    [LANGUAGE_IDS.GERMAN]: "Keine Beschreibung verfügbar.",
    [LANGUAGE_IDS.SPANISH]: "No hay descripción disponible.",
    [LANGUAGE_IDS.ITALIAN]: "Nessuna descrizione disponibile.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "暂无描述。",
  },
  "market.noItems": {
    [LANGUAGE_IDS.ENGLISH]: "No items available in this category.",
    [LANGUAGE_IDS.JAPANESE]: "このカテゴリにはアイテムがありません。",
    [LANGUAGE_IDS.KOREAN]: "이 카테고리에 아이템이 없습니다.",
    [LANGUAGE_IDS.FRENCH]: "Aucun objet disponible dans cette catégorie.",
    [LANGUAGE_IDS.GERMAN]: "Keine Items in dieser Kategorie verfügbar.",
    [LANGUAGE_IDS.SPANISH]: "No hay objetos disponibles en esta categoría.",
    [LANGUAGE_IDS.ITALIAN]: "Nessun oggetto disponibile in questa categoria.",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "该分类暂无物品。",
  },
  "market.selectCategory": {
    [LANGUAGE_IDS.ENGLISH]: "Please select another category!",
    [LANGUAGE_IDS.JAPANESE]: "別のカテゴリを選択してください！",
    [LANGUAGE_IDS.KOREAN]: "다른 카테고리를 선택해 주세요!",
    [LANGUAGE_IDS.FRENCH]: "Veuillez sélectionner une autre catégorie!",
    [LANGUAGE_IDS.GERMAN]: "Bitte wähle eine andere Kategorie!",
    [LANGUAGE_IDS.SPANISH]: "¡Por favor selecciona otra categoría!",
    [LANGUAGE_IDS.ITALIAN]: "Per favore seleziona un'altra categoria!",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "请选择其他分类！",
  },

  // Common UI elements
  "common.loading": {
    [LANGUAGE_IDS.ENGLISH]: "Loading...",
    [LANGUAGE_IDS.JAPANESE]: "読み込み中...",
    [LANGUAGE_IDS.KOREAN]: "로딩 중...",
    [LANGUAGE_IDS.FRENCH]: "Chargement...",
    [LANGUAGE_IDS.GERMAN]: "Laden...",
    [LANGUAGE_IDS.SPANISH]: "Cargando...",
    [LANGUAGE_IDS.ITALIAN]: "Caricamento...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "加载中...",
  },
  "common.loadingItems": {
    [LANGUAGE_IDS.ENGLISH]: "Loading items...",
    [LANGUAGE_IDS.JAPANESE]: "アイテムを読み込み中...",
    [LANGUAGE_IDS.KOREAN]: "아이템 로딩 중...",
    [LANGUAGE_IDS.FRENCH]: "Chargement des objets...",
    [LANGUAGE_IDS.GERMAN]: "Items werden geladen...",
    [LANGUAGE_IDS.SPANISH]: "Cargando objetos...",
    [LANGUAGE_IDS.ITALIAN]: "Caricamento oggetti...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "加载物品中...",
  },
  "common.loadingDetails": {
    [LANGUAGE_IDS.ENGLISH]: "Loading details...",
    [LANGUAGE_IDS.JAPANESE]: "詳細を読み込み中...",
    [LANGUAGE_IDS.KOREAN]: "상세 정보 로딩 중...",
    [LANGUAGE_IDS.FRENCH]: "Chargement des détails...",
    [LANGUAGE_IDS.GERMAN]: "Details werden geladen...",
    [LANGUAGE_IDS.SPANISH]: "Cargando detalles...",
    [LANGUAGE_IDS.ITALIAN]: "Caricamento dettagli...",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "加载详情中...",
  },
  "common.retry": {
    [LANGUAGE_IDS.ENGLISH]: "Retry",
    [LANGUAGE_IDS.JAPANESE]: "再試行",
    [LANGUAGE_IDS.KOREAN]: "다시 시도",
    [LANGUAGE_IDS.FRENCH]: "Réessayer",
    [LANGUAGE_IDS.GERMAN]: "Wiederholen",
    [LANGUAGE_IDS.SPANISH]: "Reintentar",
    [LANGUAGE_IDS.ITALIAN]: "Riprova",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "重试",
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
