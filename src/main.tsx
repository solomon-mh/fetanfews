import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "leaflet/dist/leaflet.css";

import App from "./App.tsx";
import { ColorContextProvider } from "./contexts/ColorContext.tsx";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { GlobalStyles, StyledEngineProvider } from "@mui/material";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ColorContextProvider>
        <StyledEngineProvider enableCssLayer>
          <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
          <App />
        </StyledEngineProvider>
      </ColorContextProvider>{" "}
    </AuthProvider>
  </StrictMode>
);
