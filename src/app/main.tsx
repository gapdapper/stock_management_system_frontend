// import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.scss";
import Home from "./routes/Home.tsx";
import * as bootstrap from 'bootstrap'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />

    </Routes>
  </BrowserRouter>
);
