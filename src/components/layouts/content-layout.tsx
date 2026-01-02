import { Outlet } from "react-router";
import { NavLink } from "react-router";
import "./content-layout.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ContentLayout() {
  return (
    <>
      <nav className="float-start position-fixed sidebar">
        <div className="headers">
          <h4>Woodentoys4u</h4>
        </div>
        <div className="import-status">
          <p>
            Daily Import Status:
            <span className="badge warning">0/1</span>
          </p>
        </div>
        <NavLink to="/">
          <FontAwesomeIcon icon={["fas", "cubes"]} />
          <span>Stock</span>
        </NavLink>
        <NavLink to="/dashboard">
          <FontAwesomeIcon icon={["fas", "chart-line"]} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/sales">
          <FontAwesomeIcon icon={["fas", "book-bookmark"]} />
          <span>Sales</span>
        </NavLink>
        <NavLink to="/import">
          <FontAwesomeIcon icon={["fas", "arrow-up-from-bracket"]} />
          <span>File Import</span>
        </NavLink>
        <NavLink to="/setting">
          <FontAwesomeIcon icon={["fas", "gear"]} />
          <span>Settings</span>
        </NavLink>
        <div className="user-info">
          <p>User</p>
        </div>
      </nav>
      <div className="container">
        <Outlet />
      </div>
    </>
  );
}

export default ContentLayout;
