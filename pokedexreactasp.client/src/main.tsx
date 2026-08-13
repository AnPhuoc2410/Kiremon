import React from "react";
import ReactDOM from "react-dom/client";
import "rpg-awesome/css/rpg-awesome.min.css";
import { HelmetProvider } from "react-helmet-async";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
