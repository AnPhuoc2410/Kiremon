import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

// Language ID constants matching PokeAPI
export const LANGUAGE_IDS = {
  JAPANESE: 1,
  ROOMAJI: 2,
  KOREAN: 3,
  CHINESE_TRADITIONAL: 4,
  FRENCH: 5,
  GERMAN: 6,
  SPANISH: 7,
  ITALIAN: 8,
  ENGLISH: 9,
  CZECH: 10,
  JAPANESE_KANJI: 11,
  CHINESE_SIMPLIFIED: 12,
} as const;

export type LanguageId = (typeof LANGUAGE_IDS)[keyof typeof LANGUAGE_IDS];

// Available languages for the selector (excluding roomaji, czech, etc.)
export interface LanguageOption {
  id: LanguageId;
  code: string;
  name: string;
  nativeName: string;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    id: LANGUAGE_IDS.ENGLISH,
    code: "en",
    name: "English",
    nativeName: "English",
  },
  {
    id: LANGUAGE_IDS.JAPANESE,
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
  },
  { id: LANGUAGE_IDS.KOREAN, code: "ko", name: "Korean", nativeName: "한국어" },
  {
    id: LANGUAGE_IDS.FRENCH,
    code: "fr",
    name: "French",
    nativeName: "Français",
  },
  {
    id: LANGUAGE_IDS.GERMAN,
    code: "de",
    name: "German",
    nativeName: "Deutsch",
  },
  {
    id: LANGUAGE_IDS.SPANISH,
    code: "es",
    name: "Spanish",
    nativeName: "Español",
  },
  {
    id: LANGUAGE_IDS.ITALIAN,
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
  },
  {
    id: LANGUAGE_IDS.CHINESE_SIMPLIFIED,
    code: "zh",
    name: "Chinese",
    nativeName: "简体中文",
  },
];

const STORAGE_KEY = "preferred-language";

interface LanguageContextType {
  languageId: LanguageId;
  setLanguage: (id: LanguageId) => void;
  currentLanguage: LanguageOption;
  availableLanguages: LanguageOption[];
}

const defaultLanguage = AVAILABLE_LANGUAGES.find(
  (l) => l.id === LANGUAGE_IDS.ENGLISH,
)!;

const LanguageContext = createContext<LanguageContextType>({
  languageId: LANGUAGE_IDS.ENGLISH,
  setLanguage: () => {},
  currentLanguage: defaultLanguage,
  availableLanguages: AVAILABLE_LANGUAGES,
});

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize from localStorage or default to English
  const [languageId, setLanguageId] = useState<LanguageId>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        // Validate it's a valid language ID
        if (AVAILABLE_LANGUAGES.some((l) => l.id === parsed)) {
          return parsed as LanguageId;
        }
      }
    } catch (e) {
      console.error("Failed to read language from localStorage:", e);
    }
    return LANGUAGE_IDS.ENGLISH;
  });

  // Persist to localStorage whenever language changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(languageId));
    } catch (e) {
      console.error("Failed to save language to localStorage:", e);
    }
  }, [languageId]);

  const setLanguage = useCallback((id: LanguageId) => {
    setLanguageId(id);
  }, []);

  const currentLanguage =
    AVAILABLE_LANGUAGES.find((l) => l.id === languageId) || defaultLanguage;

  return (
    <LanguageContext.Provider
      value={{
        languageId,
        setLanguage,
        currentLanguage,
        availableLanguages: AVAILABLE_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
