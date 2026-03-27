import { Outlet } from "react-router";
import Navbar from "../Navbar";
import "./content-layout.scss";


export default function ContentLayout() {

 return(
  <div className="layout-wrapper">
      <Navbar />
      <main className="container-fluid">
        <Outlet />
      </main>
    </div>
  );
}
