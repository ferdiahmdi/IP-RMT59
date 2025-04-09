import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  const [theme, setTheme] = useState("light"); // Default theme is "light"

  // Load the theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  // Update the theme in localStorage and apply it to the document
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <Outlet />
      <Footer />
    </>
  );
};

export default MainLayout;
