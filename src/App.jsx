import { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import i18n from "../i18n.js";
import { useTranslation } from "react-i18next"; // Import useTranslation
import Footer from "./components/Footer.jsx";

export default function App() {
  const { i18n: i18nInstance } = useTranslation(); // Get the i18n instance from the hook
  const { ready } = useTranslation(); // Get 'ready' flag

  if (!ready) {
    return <div>Loading translations...</div>; // Or a spinner, or null
  }
  useEffect(() => {
    const lang = i18nInstance.language; // Use the i18n instance from the hook
    const htmlElement = document.documentElement;

    if (lang === "ar") {
      htmlElement.classList.add("ar");
    } else {
      htmlElement.classList.remove("ar");
    }
  }, [i18nInstance.language]); // Depend on the i18n.language from the hook

  return (
    <>
      <div>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
