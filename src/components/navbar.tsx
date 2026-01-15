import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faChartLine, faBookBookmark, faArrowUpFromBracket, faGear, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/features/auth/api/logout";
import { useAuthStore } from "@/stores/authSlice";
import "./navbar.scss";
import { useImportStatusStore } from "@/stores/importStatus";


function Navbar() {
 const user = useAuthStore((s) => s.user);
 const hasImportedToday = useImportStatusStore(
  (s) => s.hasImportedToday
); 

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <>
      <nav className="float-start position-fixed sidebar">
        <div className="headers">
          <h4>Woodentoys4u</h4>
        </div>
        <div className="import-status">
          <p>
            Today's Import:
            <span className={`badge ${hasImportedToday ? "success" : "warning"}`}>
              {hasImportedToday ? "1/1" : "0/1"}
            </span>
          </p>
        </div>
        <NavLink to="/">
          <FontAwesomeIcon icon={faCubes} />
          <span>Stock</span>
        </NavLink>
        <NavLink to="/dashboard">
          <FontAwesomeIcon icon={faChartLine} />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/sales">
          <FontAwesomeIcon icon={faBookBookmark} />
          <span>Sales</span>
        </NavLink>
        <NavLink to="/import">
          <FontAwesomeIcon icon={faArrowUpFromBracket} />
          <span>File Import</span>
        </NavLink>
        {/* <NavLink to="/setting">
          <FontAwesomeIcon icon={faGear} />
          <span>Settings</span>
        </NavLink> */}
        <div className="user-info">
          <p>{user?.username ?? "Loading..."}</p>
          <button
            title="Logout"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#logoutModal"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      </nav>
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex={-1}
        aria-labelledby="logoutModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="logoutModalLabel">
                Confirm Logout
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">Are you sure you want to log out?</div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleLogout}
                data-bs-dismiss="modal"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;