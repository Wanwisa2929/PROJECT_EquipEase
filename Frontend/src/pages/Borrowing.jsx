// ✅ Borrowing.jsx (เวอร์ชันแก้ไขสมบูรณ์ เชื่อม backend และตัดของที่คืนแล้วออก)
import React, { useEffect, useState } from "react";

const LS_KEYS = {
  TOKEN: "eq_token_v1",
  CURRENT_USER: "eq_current_user",
};
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Borrowing() {
  const [list, setList] = useState([]);
  const token = JSON.parse(localStorage.getItem(LS_KEYS.TOKEN) || "null");
  const currentUser = JSON.parse(localStorage.getItem(LS_KEYS.CURRENT_USER) || "null");

  useEffect(() => {
    fetchList();
  }, []);

  // ✅ โหลดเฉพาะของที่ยังไม่คืน (Borrowed)
  async function fetchList() {
    try {
      const res = await fetch(`${API_BASE}/api/borrow`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      if (!res.ok) {
        console.error("❌ Fetch error:", text);
        alert("โหลดรายการไม่สำเร็จ");
        return;
      }

      const data = JSON.parse(text);
      const borrowedOnly = data.filter((b) => b.status === "Borrowed");
      setList(borrowedOnly);
    } catch (err) {
      console.error("❌ Error fetching borrow list:", err);
      alert("ไม่สามารถโหลดรายการได้");
    }
  }

  // ✅ คืนของแล้วลบออกจาก list + ส่งไปเก็บใน history
  async function handleReturn(borrowingId) {
    if (!window.confirm("ยืนยันการคืนอุปกรณ์?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/borrow/return`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ borrowingId }),
      });

      const text = await res.text();
      if (!res.ok) {
        console.error("❌ Return error:", text);
        alert("คืนไม่สำเร็จ");
        return;
      }

      const data = JSON.parse(text);
      console.log("✅ Return success:", data);

      // ❗ เอาออกจาก list ทันที โดยไม่ต้อง fetch ใหม่
      setList((prev) => prev.filter((b) => b._id !== borrowingId));

      // ✅ เพิ่มเข้า history
      await saveToHistory(data);
    } catch (err) {
      console.error("❌ Server error:", err);
      alert("Server error");
    }
  }

  // ✅ บันทึกลงประวัติ
  async function saveToHistory(borrowRecord) {
    try {
      const res = await fetch(`${API_BASE}/api/history/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: currentUser.username,
          item: borrowRecord.item,
          borrowDate: borrowRecord.borrowDate,
          borrowTime: borrowRecord.borrowTime,
          returnDate: new Date().toISOString().slice(0, 10),
          returnTime: new Date().toLocaleTimeString(),
          status: "Returned",
        }),
      });

      const text = await res.text();
      if (!res.ok) console.error("⚠️ Save history failed:", text);
    } catch (err) {
      console.error("⚠️ History save error:", err);
    }
  }

  return (
    <main className="content">
      <h1>📚 My Borrowings</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Item</th>
              <th>Borrow Date</th>
              <th>Borrow Time</th>
              <th>Return Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.length ? (
              list.map((b, i) => (
                <tr key={b._id}>
                  <td>{String(i + 1).padStart(3, "0")}</td>
                  <td>{b.item}</td>
                  <td>{b.borrowDate}</td>
                  <td>{b.borrowTime}</td>
                  <td>{b.returnDate || "-"}</td>
                  <td>{b.status}</td>
                  <td>
                    {b.status === "Borrowed" && (
                      <button
                        className="return-btn"
                        onClick={() => handleReturn(b._id)}
                      >
                        Return
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  ✅ ไม่มีรายการที่ยังไม่คืน
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
