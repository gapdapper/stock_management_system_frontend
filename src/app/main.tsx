// import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router";
import { createRoot } from "react-dom/client";
import "./index.scss";
import Home from "./routes/Home.tsx";
import Login from "./routes/auth/login.tsx";

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";

/* import all the icons in Free Solid, Free Regular, and Brands styles */
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import ProtectedRouteLayout from "./routes/protected-route-layout.tsx";
import ContentLayout from "@/components/layouts/content-layout.tsx";

library.add(fas, far, fab);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/auth" element={<Login />} />
      <Route element={<ProtectedRouteLayout />}>
        <Route element={<ContentLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Route>
    </Routes>
  </BrowserRouter>
);
