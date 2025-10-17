import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// CSS
import "./style.css";  
import "./Login.css";  
import "./admin/Admin.css"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  
    <BrowserRouter>
      <App />
    </BrowserRouter>
  
);
