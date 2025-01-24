import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <>
      <div>
        <Navbar />
        <main>
          {/* Pass refreshProducts and handleRefresh to child components via context */}
          <Outlet />
        </main>
      </div>
    </>
  );
}
