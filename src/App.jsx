import { useState, useEffect } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import i18n from "../i18n.js";
import { useTranslation } from "react-i18next";
import Footer from "./components/Footer.jsx";
import { ToastContainer } from "react-toastify";

export default function App() {
  const { i18n: i18nInstance } = useTranslation();

  useEffect(() => {
    // Apply notranslate class immediately when component mounts
    document.documentElement.classList.add("notranslate");

    // Handle RTL for Arabic
    const lang = i18nInstance.language;
    if (lang === "ar") {
      document.documentElement.classList.add("ar");
    } else {
      document.documentElement.classList.remove("ar");
    }

    // Optional: Add these attributes to further prevent translation
    document.documentElement.setAttribute("translate", "no");
    document.body.setAttribute("translate", "no");
  }, [i18nInstance.language]);

  return (
    <>
      <div className="min-h-screen flex flex-col notranslate">
        <Navbar />
        <main className="flex-grow">
          <Outlet />
          <ToastContainer position="top-right" autoClose={5000} />
        </main>
        <Footer />
      </div>
    </>
  );
}
