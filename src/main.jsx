import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* like NavigationContainer in RN: gives routing to the whole app */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
