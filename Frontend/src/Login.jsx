// ✅ Login.jsx (เวอร์ชันแก้ไขแล้ว)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const LS_KEYS = {
  ROLE: "eq_role_v1",
  CURRENT_USER: "eq_current_user",
  TOKEN: "eq_token_v1"
};

function writeLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function Login({ setRole }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");
      return;
    }

    try {
      console.log("📤 ส่งข้อมูลไป backend:", {
        username,
        password
      });

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username.trim(), // ✅ ไม่แปลง lowercase ป้องกัน mismatch
          password: password.trim()
        })
      });

      const data = await res.json();
      console.log("📥 ตอบกลับจาก backend:", data);

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // ✅ เก็บ token และ user ไว้ใน localStorage
      writeLS(LS_KEYS.TOKEN, data.token);
      writeLS(LS_KEYS.CURRENT_USER, data.user);
      writeLS(LS_KEYS.ROLE, data.user.role);
      setRole(data.user.role);

      alert("เข้าสู่ระบบสำเร็จ!");

      // ✅ ตรวจ role แล้วไปหน้าเหมาะสม
      if (data.user.role === "admin") {
        navigate("/admin/borrowing");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Server error:", err);
      alert("Server error กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleResetLoginForm = () => {
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-left">
          <img src="/images/Phayao.png" alt="logo" className="logo" />
          <h2>EquipEase</h2>
        </div>

        <div className="login-right">
          <h2 className="title">เข้าสู่ระบบ</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>ชื่อผู้ใช้</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="กรอกชื่อผู้ใช้ (เช่น 67025055@up.ac.th)"
                required
              />
            </div>
            <div className="form-group">
              <label>รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่าน"
                required
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-login">
                เข้าสู่ระบบ
              </button>
              <button
                type="button"
                className="btn-reset"
                onClick={handleResetLoginForm}
              >
                ล้างค่า
              </button>
            </div>
          </form>
        </div>
      </div>

      {showReset && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2>รีเซ็ตรหัสผ่าน</h2>
            <p>กรอกอีเมลเพื่อรับลิงก์รีเซ็ตรหัสผ่าน</p>
            <input
              type="email"
              placeholder="Email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="popup-buttons">
              <button
                className="submit-btn"
                onClick={() => alert("ส่งลิงก์ (จำลอง)")}
              >
                ส่งลิงก์
              </button>
              <button
                className="return-btn"
                onClick={() => setShowReset(false)}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
