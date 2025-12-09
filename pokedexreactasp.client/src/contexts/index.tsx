import React, { createContext, useState, useContext } from "react";

import { IPokeSummary, IPokemon, IPokemonType } from "../types/pokemon";
import { generatePokeSummary, loadMyPokemonFromLocalStorage } from "../helpers";

interface IGlobalContext {
  state: IState;
  setState: (param: IState) => void;
}

interface IState {
  pokeSummary?: IPokeSummary[];
  pokemons?: IPokemon[];
  pokemonTypes?: IPokemonType[];
}

const initialState: IState = {
  pokeSummary: generatePokeSummary(loadMyPokemonFromLocalStorage()),
  pokemons: [],
  pokemonTypes: [],
};

const GlobalContext = createContext<IGlobalContext>({
  state: initialState,
  setState: () => {},
});

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setGlobalContext] = useState<IState>(initialState);

  const setState = (param: IState) => {
    setGlobalContext({ ...state, ...param });
  };

  return <GlobalContext.Provider value={{ state, setState }}>{children}</GlobalContext.Provider>;
};

export { AuthProvider, useAuth } from "./AuthContext";