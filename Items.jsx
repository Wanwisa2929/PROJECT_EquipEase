import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
 
const LS_KEYS = {
  ITEMS: "eq_items_v2",
  BORROWING: "eq_borrowing",
  HISTORY: "eq_history",
};
 
function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function writeLS(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
 
const DEFAULT_ITEMS = [
  { id:1, name:"Football", type:"Ball", remaining:10 },
  { id:2, name:"Volleyball", type:"Ball", remaining:10 },
  { id:3, name:"Basketball", type:"Ball", remaining:10 },
  { id:4, name:"Tennis Ball", type:"Ball", remaining:10 },
  { id:5, name:"Petanque Ball", type:"Ball", remaining:10 },
  { id:6, name:"Futsal Ball", type:"Ball", remaining:10 },
];
 
export default function Items() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const itemId = Number(query.get("id"));
 
  const [items, setItems] = useState([]);
  const [popupItem, setPopupItem] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    borrowDate: "",
    returnDate: "",
  });
 
  useEffect(()=>{
    let data = readLS(LS_KEYS.ITEMS, []);
    if(data.length === 0){
      data = DEFAULT_ITEMS;
      writeLS(LS_KEYS.ITEMS, data);
    }
    setItems(data);
 
    if(itemId){
      const target = data.find(it=>it.id===itemId);
      if(target) openPopup(target);
    }
  },[]);
 
  function openPopup(item){
    setPopupItem(item);
    const today = new Date().toISOString().slice(0,10);
    setFormData(f=>({...f, borrowDate:today, returnDate:today}));
  }
 
  function closePopup(){ setPopupItem(null); }
 
  function handleSubmit(e){
    e.preventDefault();
    const { studentId, studentName, borrowDate, returnDate } = formData;
    if(!studentId || !studentName){ return alert("กรุณากรอกข้อมูลให้ครบ"); }
 
    const allItems = readLS(LS_KEYS.ITEMS, []);
    const target = allItems.find(it=>it.id===popupItem.id);
    if(!target) return;
 
    if(target.remaining <= 0){ return alert("อุปกรณ์หมด"); }
 
    target.remaining -= 1;
    writeLS(LS_KEYS.ITEMS, allItems);
    setItems(allItems);
 
    const borrowId = Date.now();
    const borrowing = readLS(LS_KEYS.BORROWING, []);
    borrowing.push({
      id: borrowId,
      studentId,
      studentName,
      item: target.name,
      borrowDate,
      borrowTime: new Date().toLocaleTimeString(),
      returnDate,
      status: "Borrowed"
    });
    writeLS(LS_KEYS.BORROWING, borrowing);
 
    const history = readLS(LS_KEYS.HISTORY, []);
    history.push({...borrowing[borrowing.length-1], returnTime:""});
    writeLS(LS_KEYS.HISTORY, history);
 
    setShowSuccess(true);
    closePopup();
  }
 
  return (
    <main className="content">
      <h1>Items List</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Type</th>
              <th>Status</th>
              <th>Remaining</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it=>(
              <tr key={it.id}>
                <td>{it.name}</td>
                <td>{it.type}</td>
                <td>
                  {it.remaining>0 ?
                    <span className="status available" onClick={()=>openPopup(it)}>Available</span> :
                    <span className="status borrowed">Out of stock</span>
                  }
                </td>
                <td>{it.remaining}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
      {/* Popup Form */}
      {popupItem && (
        <div className="popup-overlay">
          <div className="popup-card">
            <form onSubmit={handleSubmit}>
              <h2>{popupItem.name}</h2>
              <label>Student ID:</label>
              <input value={formData.studentId} onChange={e=>setFormData({...formData, studentId:e.target.value})} />
              <label>Name:</label>
              <input value={formData.studentName} onChange={e=>setFormData({...formData, studentName:e.target.value})} />
              <label>Borrow Date:</label>
              <input type="date" value={formData.borrowDate} onChange={e=>setFormData({...formData, borrowDate:e.target.value})} />
              <label>Return Date:</label>
              <input type="date" value={formData.returnDate} onChange={e=>setFormData({...formData, returnDate:e.target.value})} />
              <button className="submit-btn" type="submit">Submit</button>
              <button type="button" className="return-btn" onClick={closePopup}>Close</button>
            </form>
          </div>
        </div>
      )}
 
      {/* Popup Success */}
      {showSuccess && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>สำเร็จ</h2>
            <p>คุณได้ทำการยืมอุปกรณ์เรียบร้อยแล้ว</p>
            <button className="submit-btn" onClick={()=>setShowSuccess(false)}>ปิด</button>
          </div>
        </div>
      )}
    </main>
  );
}
 
 
