import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile({ setRole }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear role and current user
    localStorage.removeItem("eq_current_user");
    localStorage.removeItem("eq_role_v1");
    if (typeof setRole === "function") setRole(null);
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <div className="profile-icon" onClick={() => setOpen(!open)}>
        👤
      </div>

      {open && (
        <div className="profile-menu">
          <button className="logout-btn" onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}
