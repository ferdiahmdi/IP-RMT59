import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Entries from "./pages/Entries";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<Home />} />

        <Route path="/collections" element={<Collections />} />
        <Route
          path="/collections/:userId/:collectionId"
          element={<Entries />}
        />
      </Route>
    </Routes>
  </BrowserRouter>
);
