import { LANGUAGE_IDS, LanguageId } from "@/contexts";

// Pokemon type translations for all supported languages
// Based on PokeAPI language IDs
const TYPE_TRANSLATIONS: Record<string, Record<number, string>> = {
  normal: {
    [LANGUAGE_IDS.ENGLISH]: "Normal",
    [LANGUAGE_IDS.JAPANESE]: "ノーマル",
    [LANGUAGE_IDS.KOREAN]: "노말",
    [LANGUAGE_IDS.FRENCH]: "Normal",
    [LANGUAGE_IDS.GERMAN]: "Normal",
    [LANGUAGE_IDS.SPANISH]: "Normal",
    [LANGUAGE_IDS.ITALIAN]: "Normale",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "一般",
  },
  fire: {
    [LANGUAGE_IDS.ENGLISH]: "Fire",
    [LANGUAGE_IDS.JAPANESE]: "ほのお",
    [LANGUAGE_IDS.KOREAN]: "불꽃",
    [LANGUAGE_IDS.FRENCH]: "Feu",
    [LANGUAGE_IDS.GERMAN]: "Feuer",
    [LANGUAGE_IDS.SPANISH]: "Fuego",
    [LANGUAGE_IDS.ITALIAN]: "Fuoco",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "火",
  },
  water: {
    [LANGUAGE_IDS.ENGLISH]: "Water",
    [LANGUAGE_IDS.JAPANESE]: "みず",
    [LANGUAGE_IDS.KOREAN]: "물",
    [LANGUAGE_IDS.FRENCH]: "Eau",
    [LANGUAGE_IDS.GERMAN]: "Wasser",
    [LANGUAGE_IDS.SPANISH]: "Agua",
    [LANGUAGE_IDS.ITALIAN]: "Acqua",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "水",
  },
  electric: {
    [LANGUAGE_IDS.ENGLISH]: "Electric",
    [LANGUAGE_IDS.JAPANESE]: "でんき",
    [LANGUAGE_IDS.KOREAN]: "전기",
    [LANGUAGE_IDS.FRENCH]: "Électrik",
    [LANGUAGE_IDS.GERMAN]: "Elektro",
    [LANGUAGE_IDS.SPANISH]: "Eléctrico",
    [LANGUAGE_IDS.ITALIAN]: "Elettro",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "电",
  },
  grass: {
    [LANGUAGE_IDS.ENGLISH]: "Grass",
    [LANGUAGE_IDS.JAPANESE]: "くさ",
    [LANGUAGE_IDS.KOREAN]: "풀",
    [LANGUAGE_IDS.FRENCH]: "Plante",
    [LANGUAGE_IDS.GERMAN]: "Pflanze",
    [LANGUAGE_IDS.SPANISH]: "Planta",
    [LANGUAGE_IDS.ITALIAN]: "Erba",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "草",
  },
  ice: {
    [LANGUAGE_IDS.ENGLISH]: "Ice",
    [LANGUAGE_IDS.JAPANESE]: "こおり",
    [LANGUAGE_IDS.KOREAN]: "얼음",
    [LANGUAGE_IDS.FRENCH]: "Glace",
    [LANGUAGE_IDS.GERMAN]: "Eis",
    [LANGUAGE_IDS.SPANISH]: "Hielo",
    [LANGUAGE_IDS.ITALIAN]: "Ghiaccio",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "冰",
  },
  fighting: {
    [LANGUAGE_IDS.ENGLISH]: "Fighting",
    [LANGUAGE_IDS.JAPANESE]: "かくとう",
    [LANGUAGE_IDS.KOREAN]: "격투",
    [LANGUAGE_IDS.FRENCH]: "Combat",
    [LANGUAGE_IDS.GERMAN]: "Kampf",
    [LANGUAGE_IDS.SPANISH]: "Lucha",
    [LANGUAGE_IDS.ITALIAN]: "Lotta",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "格斗",
  },
  poison: {
    [LANGUAGE_IDS.ENGLISH]: "Poison",
    [LANGUAGE_IDS.JAPANESE]: "どく",
    [LANGUAGE_IDS.KOREAN]: "독",
    [LANGUAGE_IDS.FRENCH]: "Poison",
    [LANGUAGE_IDS.GERMAN]: "Gift",
    [LANGUAGE_IDS.SPANISH]: "Veneno",
    [LANGUAGE_IDS.ITALIAN]: "Veleno",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "毒",
  },
  ground: {
    [LANGUAGE_IDS.ENGLISH]: "Ground",
    [LANGUAGE_IDS.JAPANESE]: "じめん",
    [LANGUAGE_IDS.KOREAN]: "땅",
    [LANGUAGE_IDS.FRENCH]: "Sol",
    [LANGUAGE_IDS.GERMAN]: "Boden",
    [LANGUAGE_IDS.SPANISH]: "Tierra",
    [LANGUAGE_IDS.ITALIAN]: "Terra",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "地面",
  },
  flying: {
    [LANGUAGE_IDS.ENGLISH]: "Flying",
    [LANGUAGE_IDS.JAPANESE]: "ひこう",
    [LANGUAGE_IDS.KOREAN]: "비행",
    [LANGUAGE_IDS.FRENCH]: "Vol",
    [LANGUAGE_IDS.GERMAN]: "Flug",
    [LANGUAGE_IDS.SPANISH]: "Volador",
    [LANGUAGE_IDS.ITALIAN]: "Volante",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "飞行",
  },
  psychic: {
    [LANGUAGE_IDS.ENGLISH]: "Psychic",
    [LANGUAGE_IDS.JAPANESE]: "エスパー",
    [LANGUAGE_IDS.KOREAN]: "에스퍼",
    [LANGUAGE_IDS.FRENCH]: "Psy",
    [LANGUAGE_IDS.GERMAN]: "Psycho",
    [LANGUAGE_IDS.SPANISH]: "Psíquico",
    [LANGUAGE_IDS.ITALIAN]: "Psico",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "超能力",
  },
  bug: {
    [LANGUAGE_IDS.ENGLISH]: "Bug",
    [LANGUAGE_IDS.JAPANESE]: "むし",
    [LANGUAGE_IDS.KOREAN]: "벌레",
    [LANGUAGE_IDS.FRENCH]: "Insecte",
    [LANGUAGE_IDS.GERMAN]: "Käfer",
    [LANGUAGE_IDS.SPANISH]: "Bicho",
    [LANGUAGE_IDS.ITALIAN]: "Coleottero",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "虫",
  },
  rock: {
    [LANGUAGE_IDS.ENGLISH]: "Rock",
    [LANGUAGE_IDS.JAPANESE]: "いわ",
    [LANGUAGE_IDS.KOREAN]: "바위",
    [LANGUAGE_IDS.FRENCH]: "Roche",
    [LANGUAGE_IDS.GERMAN]: "Gestein",
    [LANGUAGE_IDS.SPANISH]: "Roca",
    [LANGUAGE_IDS.ITALIAN]: "Roccia",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "岩石",
  },
  ghost: {
    [LANGUAGE_IDS.ENGLISH]: "Ghost",
    [LANGUAGE_IDS.JAPANESE]: "ゴースト",
    [LANGUAGE_IDS.KOREAN]: "고스트",
    [LANGUAGE_IDS.FRENCH]: "Spectre",
    [LANGUAGE_IDS.GERMAN]: "Geist",
    [LANGUAGE_IDS.SPANISH]: "Fantasma",
    [LANGUAGE_IDS.ITALIAN]: "Spettro",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "幽灵",
  },
  dragon: {
    [LANGUAGE_IDS.ENGLISH]: "Dragon",
    [LANGUAGE_IDS.JAPANESE]: "ドラゴン",
    [LANGUAGE_IDS.KOREAN]: "드래곤",
    [LANGUAGE_IDS.FRENCH]: "Dragon",
    [LANGUAGE_IDS.GERMAN]: "Drache",
    [LANGUAGE_IDS.SPANISH]: "Dragón",
    [LANGUAGE_IDS.ITALIAN]: "Drago",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "龙",
  },
  dark: {
    [LANGUAGE_IDS.ENGLISH]: "Dark",
    [LANGUAGE_IDS.JAPANESE]: "あく",
    [LANGUAGE_IDS.KOREAN]: "악",
    [LANGUAGE_IDS.FRENCH]: "Ténèbres",
    [LANGUAGE_IDS.GERMAN]: "Unlicht",
    [LANGUAGE_IDS.SPANISH]: "Siniestro",
    [LANGUAGE_IDS.ITALIAN]: "Buio",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "恶",
  },
  steel: {
    [LANGUAGE_IDS.ENGLISH]: "Steel",
    [LANGUAGE_IDS.JAPANESE]: "はがね",
    [LANGUAGE_IDS.KOREAN]: "강철",
    [LANGUAGE_IDS.FRENCH]: "Acier",
    [LANGUAGE_IDS.GERMAN]: "Stahl",
    [LANGUAGE_IDS.SPANISH]: "Acero",
    [LANGUAGE_IDS.ITALIAN]: "Acciaio",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "钢",
  },
  fairy: {
    [LANGUAGE_IDS.ENGLISH]: "Fairy",
    [LANGUAGE_IDS.JAPANESE]: "フェアリー",
    [LANGUAGE_IDS.KOREAN]: "페어리",
    [LANGUAGE_IDS.FRENCH]: "Fée",
    [LANGUAGE_IDS.GERMAN]: "Fee",
    [LANGUAGE_IDS.SPANISH]: "Hada",
    [LANGUAGE_IDS.ITALIAN]: "Folletto",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "妖精",
  },
};

/**
 * Get localized type name
 * @param type - English type name (lowercase)
 * @param languageId - Language ID from context
 * @returns Localized type name, falls back to capitalized English if not found
 */
export function getLocalizedTypeName(
  type: string,
  languageId: LanguageId,
): string {
  const normalizedType = type.toLowerCase();
  const translations = TYPE_TRANSLATIONS[normalizedType];

  if (!translations) {
    // Unknown type, return capitalized version
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

  return (
    translations[languageId] ||
    translations[LANGUAGE_IDS.ENGLISH] ||
    type.charAt(0).toUpperCase() + type.slice(1)
  );
}

/**
 * Get all type names for a specific language
 * Useful for filters, search, etc.
 */
export function getAllTypeNames(
  languageId: LanguageId,
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [englishType, translations] of Object.entries(TYPE_TRANSLATIONS)) {
    result[englishType] =
      translations[languageId] || translations[LANGUAGE_IDS.ENGLISH];
  }

  return result;
}

// Common Pokemon labels translations
const LABEL_TRANSLATIONS: Record<string, Record<number, string>> = {
  legendary: {
    [LANGUAGE_IDS.ENGLISH]: "Legendary",
    [LANGUAGE_IDS.JAPANESE]: "伝説",
    [LANGUAGE_IDS.KOREAN]: "전설의",
    [LANGUAGE_IDS.FRENCH]: "Légendaire",
    [LANGUAGE_IDS.GERMAN]: "Legendär",
    [LANGUAGE_IDS.SPANISH]: "Legendario",
    [LANGUAGE_IDS.ITALIAN]: "Leggendario",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "传说",
  },
  mythical: {
    [LANGUAGE_IDS.ENGLISH]: "Mythical",
    [LANGUAGE_IDS.JAPANESE]: "幻",
    [LANGUAGE_IDS.KOREAN]: "환상의",
    [LANGUAGE_IDS.FRENCH]: "Fabuleux",
    [LANGUAGE_IDS.GERMAN]: "Mysteriös",
    [LANGUAGE_IDS.SPANISH]: "Singular",
    [LANGUAGE_IDS.ITALIAN]: "Misterioso",
    [LANGUAGE_IDS.CHINESE_SIMPLIFIED]: "幻之",
  },
};

/**
 * Get localized label (Legendary, Mythical, etc.)
 * @param label - English label name (case insensitive)
 * @param languageId - Language ID from context
 * @returns Localized label, falls back to English if not found
 */
export function getLocalizedLabel(
  label: string,
  languageId: LanguageId,
): string {
  const normalizedLabel = label.toLowerCase();
  const translations = LABEL_TRANSLATIONS[normalizedLabel];

  if (!translations) {
    return label;
  }

  return (
    translations[languageId] || translations[LANGUAGE_IDS.ENGLISH] || label
  );
}

export default TYPE_TRANSLATIONS;
