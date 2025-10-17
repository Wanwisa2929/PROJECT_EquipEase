// History.jsx
import React, { useEffect, useState } from "react";

const LS_KEYS = { CURRENT_USER: "eq_current_user" };
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function History() {
  const [history, setHistory] = useState([]);
  const user = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch(`${API_BASE}/api/borrow/history?studentId=${user?.username}`);
      const data = await res.json();
      setHistory(data);
    } catch {
      alert("ไม่สามารถโหลดข้อมูลประวัติได้");
    }
  }

  return (
    <main className="content">
      <h1>📜 History</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No.</th><th>Item</th><th>Borrow Date</th><th>Borrow Time</th><th>Return Date</th><th>Return Time</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length ? history.map((h, i) => (
              <tr key={h._id}>
                <td>{i + 1}</td>
                <td>{h.item}</td>
                <td>{h.borrowDate}</td>
                <td>{h.borrowTime}</td>
                <td>{h.returnDate}</td>
                <td>{h.returnTime || "-"}</td>
                <td>{h.status}</td>
              </tr>
            )) : (
              <tr><td colSpan="7" className="no-data">ไม่มีข้อมูล</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
