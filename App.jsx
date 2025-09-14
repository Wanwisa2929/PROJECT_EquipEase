import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Items from "./pages/Items";
import Borrowing from "./pages/Borrowing";
import History from "./pages/History";
import "./style.css";

export default function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/borrowing" element={<Borrowing />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  );
}
