// Items.jsx
import React, { useEffect, useState } from "react";
import "../style.css";

const LS_KEYS = {
  CURRENT_USER: "eq_current_user",
  TOKEN: "eq_token_v1",
};
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Items() {
  const [items, setItems] = useState([]);
  const [popupItem, setPopupItem] = useState(null);
  const [formData, setFormData] = useState({ studentId: "", studentName: "", borrowDate: "", returnDate: "" });
  const [showSuccess, setShowSuccess] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");
  const token = JSON.parse(localStorage.getItem(LS_KEYS.TOKEN) || "null");

  useEffect(() => {
    fetchItems();
    const today = new Date().toISOString().slice(0, 10);
    setFormData(f => ({ ...f, borrowDate: today, returnDate: today, studentId: currentUser?.username || "" }));
  }, []);

  async function fetchItems() {
    try {
      const res = await fetch(`${API_BASE}/api/items`);
      const data = await res.json();
      setItems(data);
    } catch {
      alert("ไม่สามารถโหลดรายการได้");
    }
  }

  function openPopup(item) {
    setPopupItem(item);
    const today = new Date().toISOString().slice(0, 10);
    setFormData({
      studentId: currentUser?.username || "",
      studentName: currentUser?.name || "",
      borrowDate: today,
      returnDate: today
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!popupItem) return;
    try {
      const res = await fetch(`${API_BASE}/api/borrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          studentId: formData.studentId,
          studentName: formData.studentName,
          item: popupItem.name,
          borrowDate: formData.borrowDate,
          returnDate: formData.returnDate
        })
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "ยืมไม่สำเร็จ");
      alert("บันทึกการยืมเรียบร้อยแล้ว ✅");
      setShowSuccess(true);
      setPopupItem(null);
      fetchItems();
    } catch {
      alert("Server error");
    }
  }

  return (
    <main className="content">
      <h1>📦 Items List</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th><th>Type</th><th>Status</th><th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it._id}>
                <td>{it.name}</td>
                <td>{it.type}</td>
                <td>
                  {it.remaining > 0 ?
                    <span className="status available" onClick={() => openPopup(it)}>Available</span> :
                    <span className="status borrowed">Out of stock</span>}
                </td>
                <td>{it.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {popupItem && (
        <div className="popup-overlay">
          <div className="popup-card">
            <form onSubmit={handleSubmit}>
              <h2>{popupItem.name}</h2>
              <label>Student ID:</label>
              <input value={formData.studentId} onChange={e => setFormData({ ...formData, studentId: e.target.value })} />
              <label>Name:</label>
              <input value={formData.studentName} onChange={e => setFormData({ ...formData, studentName: e.target.value })} />
              <label>Borrow Date:</label>
              <input type="date" value={formData.borrowDate} onChange={e => setFormData({ ...formData, borrowDate: e.target.value })} />
              <label>Return Date:</label>
              <input type="date" value={formData.returnDate} onChange={e => setFormData({ ...formData, returnDate: e.target.value })} />
              <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 12 }}>
                <button className="submit-btn" type="submit">Submit</button>
                <button type="button" className="return-btn" onClick={() => setPopupItem(null)}>Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
