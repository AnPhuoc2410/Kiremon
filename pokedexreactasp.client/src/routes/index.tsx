import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { StartScreen, MyPokemon, NotFoundPage } from "../pages";

const Explore = lazy(() => import("../pages/Explore"));
const RegionsExplore = lazy(() => import("../pages/Explore/Regions"));
const RegionDetail = lazy(() => import("../pages/Explore/Regions/RegionDetail"));
const TypesExplore = lazy(() => import("../pages/Explore/Types"));
const GenerationsExplore = lazy(() => import("../pages/Explore/Generations"));
const GenerationDetail = lazy(() => import("../pages/Explore/GenerationDetail"));
const Detail = lazy(() => import("../pages/Detail"));
const WhosThatPokemon = lazy(() => import("../pages/WhosThatPokemon"));
const CombatTeam = lazy(() => import("../pages/CombatTeam"));
const Search = lazy(() => import("../pages/Search"));
const GamesHub = lazy(() => import("../pages/Games"));
// New games
const TypeMatchup = lazy(() => import("../pages/TypeMatchup/index.tsx"));
const CatchChallenge = lazy(() => import("../pages/CatchChallenge/index.tsx"));

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<StartScreen />} />
        <Route
          path="/pokemons"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Explore />
            </Suspense>
          }
        />
        {/* Region routes */}
        <Route
          path="/regions"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegionsExplore />
            </Suspense>
          }
        />
        <Route
          path="/regions/:regionName"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegionDetail />
            </Suspense>
          }
        />
        {/* Keep the old path for backward compatibility */}
        <Route
          path="/explore/regions"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <RegionsExplore />
            </Suspense>
          }
        />
        <Route
          path="/explore/types"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <TypesExplore />
            </Suspense>
          }
        />
        <Route
          path="/explore/generations"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <GenerationsExplore />
            </Suspense>
          }
        />
        <Route
          path="/explore/generations/:genId"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <GenerationDetail />
            </Suspense>
          }
        />
        <Route
          path="/pokemon/:name"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Detail />
            </Suspense>
          }
        />
        <Route path="/my-pokemon" element={<MyPokemon />} />
        <Route
          path="/games"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <GamesHub />
            </Suspense>
          }
        />
        <Route
          path="/games/whos-that-pokemon"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WhosThatPokemon />
            </Suspense>
          }
        />
        <Route path="/games/combat-team" element={<CombatTeam />} />
        {/* New games routes */}
        <Route
          path="/games/type-matchup"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <TypeMatchup />
            </Suspense>
          }
        />
        <Route
          path="/games/catch-challenge"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <CatchChallenge />
            </Suspense>
          }
        />
        {/* New search route */}
        <Route
          path="/search"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Search />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Switch>
    </BrowserRouter>
  );
}
