import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./index.css";
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Collections from "./pages/Collections";
import Entries from "./components/Entries";
import store from "./redux/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/home" element={<Navigate to="/home/anime" replace />} />
          <Route path="/home/:type" element={<Home />} />

          <Route path="/collections" element={<Collections />} />
        </Route>
      </Routes>
    </Provider>
  </BrowserRouter>
);
