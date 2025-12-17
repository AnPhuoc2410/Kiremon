import React, { createContext, useState, useContext, useCallback } from "react";

import { IPokeSummary, IPokemon, IPokemonType } from "../types/pokemon";
import { collectionService } from "../services";

interface IGlobalContext {
  state: IState;
  setState: (param: IState) => void;
  refreshPokeSummary: () => Promise<void>;
}

interface IState {
  pokeSummary?: IPokeSummary[];
  pokemons?: IPokemon[];
  pokemonTypes?: IPokemonType[];
}

const initialState: IState = {
  pokeSummary: [],
  pokemons: [],
  pokemonTypes: [],
};


const GlobalContext = createContext<IGlobalContext>({
  state: initialState,
  setState: () => {},
  refreshPokeSummary: async () => {},
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setGlobalContext] = useState<IState>(initialState);

  const setState = (param: IState) => {
    setGlobalContext((prev) => ({ ...prev, ...param }));
  };

  // Function to load pokeSummary from optimized API endpoint
  const refreshPokeSummary = useCallback(async () => {
    try {
      const response = await collectionService.getPokeSummary();
      if (response && response.summary && response.summary.length > 0) {
        // Transform API response to IPokeSummary format
        const summary: IPokeSummary[] = response.summary.map((p) => ({
          name: p.name,
          captured: p.captured,
        }));
        setGlobalContext((prev) => ({ ...prev, pokeSummary: summary }));
      } else {
        setGlobalContext((prev) => ({ ...prev, pokeSummary: [] }));
      }
    } catch (error) {
      console.error("Failed to load pokeSummary:", error);
      // On error (e.g., not authenticated), set empty summary
      setGlobalContext((prev) => ({ ...prev, pokeSummary: [] }));
    }
  }, []);

  return (
    <GlobalContext.Provider value={{ state, setState, refreshPokeSummary }}>
      {children}
    </GlobalContext.Provider>
  );
};

export { AuthProvider, useAuth } from "./AuthContext";
