import { Outlet } from "react-router";
import Navbar from "../avbar";
import "./content-layout.scss";
import { useEffect } from "react";
import { useImportStatusStore } from "@/stores/importStatus";


export default function ContentLayout() {
  const checkImportStatus = useImportStatusStore((s) => s.fetchImportStatus);

  useEffect(() => {
    checkImportStatus();
  }, []);

 return(
  <div className="layout-wrapper">
      <Navbar />
      <main className="container-fluid">
        <Outlet />
      </main>
    </div>
  );
}
