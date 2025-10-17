// AdminHistory.jsx
import React, { useEffect, useState, useRef } from "react";
import "./Admin.css";

const LS_KEYS = { TOKEN: "eq_token_v1" };
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function toMMDDYYYY(isoDate) {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${m}/${d}/${y}`;
}

export default function AdminHistory() {
  const [history, setHistory] = useState([]);
  const [dateISO, setDateISO] = useState(() => new Date().toISOString().slice(0, 10));
  const [showAll, setShowAll] = useState(false);
  const dateInputRef = useRef(null);
  const token = JSON.parse(localStorage.getItem(LS_KEYS.TOKEN) || "null");

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch(`${API_BASE}/api/borrow/admin/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHistory(data || []);
    } catch (err) {
      console.error(err);
      alert("ไม่สามารถโหลดข้อมูลได้");
    }
  }

  function openDatePicker() {
    if (dateInputRef.current)
      dateInputRef.current.showPicker?.() ?? dateInputRef.current.focus();
  }

  function handleDateChange(e) {
    setDateISO(e.target.value);
    setShowAll(false);
  }

  const filtered = showAll
    ? history
    : history.filter((b) => b.borrowDate === dateISO || b.returnDate === dateISO);

  return (
    <div className="admin-content">
      <div className="date-control">
        <div className="date-box">
          <div className="page-date-button" role="button" onClick={openDatePicker}>
            <span className="page-date-text">{toMMDDYYYY(dateISO)}</span>
            <input
              ref={dateInputRef}
              className="page-date-input"
              type="date"
              value={dateISO}
              onChange={handleDateChange}
            />
          </div>
          <button className="submit-btn" onClick={() => setShowAll(true)}>
            See all
          </button>
        </div>
      </div>


      <h1 className="admin-title">
        📜 History {showAll ? "(ทั้งหมด)" : `(${toMMDDYYYY(dateISO)})`}
      </h1>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Student ID</th>
              <th>Name</th>
              <th>Item</th>
              <th>Borrow Date</th>
              <th>Borrow Time</th>
              <th>Return Date</th>
              <th>Return Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((b, i) => (
                <tr key={b._id}>
                  <td>{String(i + 1).padStart(3, "0")}</td>
                  <td>{b.studentId}</td>
                  <td>{b.studentName}</td>
                  <td>{b.item}</td>
                  <td>{b.borrowDate}</td>
                  <td>{b.borrowTime}</td>
                  <td>{b.returnDate || "-"}</td>
                  <td>{b.returnTime || "-"}</td>
                  <td>{b.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="no-data">
                  ไม่มีรายการ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
