import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { StartScreen, MyPokemon, NotFoundPage } from "../pages";

const Explore = lazy(() => import("../pages/Explore"));
const RegionsExplore = lazy(() => import("../pages/Explore/Regions"));
const RegionDetail = lazy(() => import("../pages/Explore/Regions/RegionDetail"));
const TypesExplore = lazy(() => import("../pages/Explore/Types"));
const GenerationsExplore = lazy(() => import("../pages/Explore/Generations"));
const Detail = lazy(() => import("../pages/Detail"));
const WhosThatPokemon = lazy(() => import("../pages/WhosThatPokemon"));

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
          path="/pokemon/:name"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Detail />
            </Suspense>
          }
        />
        <Route path="/my-pokemon" element={<MyPokemon />} />
        <Route
          path="games/whos-that-pokemon"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <WhosThatPokemon />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Switch>
    </BrowserRouter>
  );
}
