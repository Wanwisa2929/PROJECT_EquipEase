import React, { useEffect, useState } from "react";

const LS_KEYS = {
  HISTORY: "eq_history",
};

function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(readLS(LS_KEYS.HISTORY, []));
  }, []);

  return (
    <main className="content">
      <h1>History</h1>
      <div className="table-container">
        <table id="historyTable">
          <thead>
            <tr>
              <th>Number</th>
              <th>Item</th>
              <th>Borrowing Date</th>
              <th>Borrowing Time</th>
              <th>Return Date</th>
              <th>Return Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? history.map((h,i)=>(
              <tr key={h.id}>
                <td>{String(i+1).padStart(3,'0')}</td>
                <td>{h.item}</td>
                <td>{h.borrowDate}</td>
                <td>{h.borrowTime}</td>
                <td>{h.returnDate}</td>
                <td>{h.returnTime || "-"}</td>
                <td>{h.status}</td>
              </tr>
            )) : <tr><td colSpan="7" style={{textAlign:"center",color:"#777"}}>Empty</td></tr>}
          </tbody>
        </table>
      </div>
    </main>
  );
}
