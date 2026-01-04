import { Outlet } from "react-router";
import Navbar from "../navbar";
import "./content-layout.scss";


export default function ContentLayout() {
 return(
  <>
      <Navbar />
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}
