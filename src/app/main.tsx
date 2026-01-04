  // import { StrictMode } from 'react'
  import { BrowserRouter, Routes, Route } from "react-router";
  import { createRoot } from "react-dom/client";
  import "./index.scss";
  import Home from "./routes/Home.tsx";
  import Login from "./routes/auth/login.tsx";
  import { library } from "@fortawesome/fontawesome-svg-core";
  import * as bootstrap from 'bootstrap'

  /* import all the icons in Free Solid, Free Regular, and Brands styles */
  import { fas } from "@fortawesome/free-solid-svg-icons";
  import { far } from "@fortawesome/free-regular-svg-icons";
  import { fab } from "@fortawesome/free-brands-svg-icons";
  import ProtectedRoute from "@/app/routes/protected-route.tsx";
  import PublicRoute from "@/app/routes/public-route.tsx";
  import ContentLayout from "@/components/layouts/content-layout.tsx";
  import AuthProvider from "./auth-provider.tsx";
  import AuthSync from "./routes/auth/AuthSync.tsx";

  library.add(fas, far, fab);

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <AuthSync />
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Login />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ContentLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Route>

      </Routes>

    </BrowserRouter>
    </AuthProvider>
  );
