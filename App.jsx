import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Profile from "./components/Profile";

// user pages
import Home from "./pages/Home";
import Items from "./pages/Items";
import Borrowing from "./pages/Borrowing";
import History from "./pages/History";

// admin 
import AdminLayout from "./admin/AdminLayout";   // import layout
// Admin nested routes are inside AdminLayout

// login
import Login from "./Login";

const LS_KEYS = {
  ROLE: "eq_role_v1",
  CURRENT_USER: "eq_current_user",
  ITEMS: "eq_items_v2"
};

const DEFAULT_ITEMS = [
  { id:1, name:"Football", type:"Ball", remaining:10 },
  { id:2, name:"Volleyball", type:"Ball", remaining:10 },
  { id:3, name:"Basketball", type:"Ball", remaining:10 },
  { id:4, name:"Tennis Ball", type:"Ball", remaining:10 },
  { id:5, name:"Petanque Ball", type:"Ball", remaining:10 },
  { id:6, name:"Futsal Ball", type:"Ball", remaining:10 },
];

function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export default function App() {
  // keep API same as original: setRole used by Login/Profile
  const [role, setRoleState] = useState(() => readLS(LS_KEYS.ROLE, null));

  // persist current user (username) if needed — keep same API surface
  useEffect(() => {
    // initialize items if absent (preserve original UI behavior)
    const items = readLS(LS_KEYS.ITEMS, []);
    if (!items || items.length === 0) {
      writeLS(LS_KEYS.ITEMS, DEFAULT_ITEMS);
    }
  }, []);

  useEffect(() => {
    writeLS(LS_KEYS.ROLE, role);
  }, [role]);

  function setRole(newRole) {
    // keep same name as original but persist role
    setRoleState(newRole);
    if (!newRole) {
      localStorage.removeItem(LS_KEYS.CURRENT_USER);
      localStorage.removeItem(LS_KEYS.ROLE);
    } else {
      writeLS(LS_KEYS.ROLE, newRole);
    }
  }

  return (
    <Routes>
      {/* Login */}
      <Route path="/login" element={<Login setRole={setRole} />} />

      {/* User Layout (exactly same markup as original) */}
      {role === "user" && (
        <>
          <Route
            path="/"
            element={
              <div className="layout">
                <Sidebar />
                <Profile setRole={setRole} />
                <div className="content"><Home /></div>
              </div>
            }
          />
          <Route
            path="/items"
            element={
              <div className="layout">
                <Sidebar />
                <Profile setRole={setRole} />
                <div className="content"><Items /></div>
              </div>
            }
          />
          <Route
            path="/borrowing"
            element={
              <div className="layout">
                <Sidebar />
                <Profile setRole={setRole} />
                <div className="content"><Borrowing /></div>
              </div>
            }
          />
          <Route
            path="/history"
            element={
              <div className="layout">
                <Sidebar />
                <Profile setRole={setRole} />
                <div className="content"><History /></div>
              </div>
            }
          />
        </>
      )}

      {/* Admin Layout (uses original AdminLayout markup) */}
      {role === "admin" && (
        <Route path="/admin/*" element={<AdminLayout role={role} setRole={setRole} />} />
      )}

      {/* ถ้าไม่ล็อกอิน → ส่งไป login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
