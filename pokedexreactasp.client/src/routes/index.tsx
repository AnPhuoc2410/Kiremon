import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { StartScreen, MyPokemon, NotFoundPage } from "../pages";

const Explore = lazy(() => import("../pages/Explore"));
const Detail = lazy(() => import("../pages/Detail"));

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
        <Route
          path="/pokemon/:name"
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <Detail />
            </Suspense>
          }
        />
        <Route path="/my-pokemon" element={<MyPokemon />} />
        <Route path="*" element={<NotFoundPage />} />
      </Switch>
    </BrowserRouter>
  );
}
