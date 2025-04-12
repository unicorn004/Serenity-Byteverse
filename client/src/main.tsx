import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Imp/ort Tailwind CSS
import "./globals.css"
import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);