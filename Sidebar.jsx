import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        <img src="/images/Phayao.png" alt="Logo" />
        <h2>EquipEase</h2>
      </div>
      <ul className="menu">
        <li>
          <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>
            <img src="/images/index.png" alt="Home" className="icon" /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/items" className={({isActive}) => isActive ? "active" : ""}>
            <img src="/images/items.png" alt="Items" className="icon" /> Items List
          </NavLink>
        </li>
        <li>
          <NavLink to="/borrowing" className={({isActive}) => isActive ? "active" : ""}>
            <img src="/images/borrowing.png" alt="Borrowing" className="icon" /> My Borrowing
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({isActive}) => isActive ? "active" : ""}>
            <img src="/images/history.png" alt="History" className="icon" /> History
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
