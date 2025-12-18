import { BrowserRouter, Routes as Switch, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import { StartScreen, NotFoundPage } from "../pages";
import { AuthProvider } from "../contexts";

const MyPokemon = lazy(() => import("../pages/MyPokemon"));

const Explore = lazy(() => import("../pages/Explore"));
const RegionsExplore = lazy(() => import("../pages/Explore/Regions"));
const RegionDetail = lazy(
  () => import("../pages/Explore/Regions/RegionDetail"),
);
const TypesExplore = lazy(() => import("../pages/Explore/Types"));
const GenerationsExplore = lazy(() => import("../pages/Explore/Generations"));
const GenerationDetail = lazy(
  () => import("../pages/Explore/GenerationDetail"),
);
const Detail = lazy(() => import("../pages/Detail"));
const WhosThatPokemon = lazy(() => import("../pages/WhosThatPokemon"));
const CombatTeam = lazy(() => import("../pages/CombatTeam"));
const Search = lazy(() => import("../pages/Search"));
// New games
const TypeMatchup = lazy(() => import("../pages/TypeMatchup/index.tsx"));
const CatchChallenge = lazy(() => import("../pages/CatchChallenge/index.tsx"));
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const Forgot = lazy(() => import("../pages/Auth/Forgot"));
const ConfirmEmail = lazy(() => import("../pages/Auth/ConfirmEmail"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));

export default function Routes() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
          <Route
            path="/my-pokemon"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <MyPokemon />
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
          <Route
            path="/games/combat-team"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <CombatTeam />
              </Suspense>
            }
          />
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
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/forgot"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Forgot />
              </Suspense>
            }
          />
          <Route
            path="/auth/confirm-email"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ConfirmEmail />
              </Suspense>
            }
          />
          <Route
            path="/auth/reset-password"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ResetPassword />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Profile />
              </Suspense>
            }
          />
          <Route
            path="/settings"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <Settings />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}
