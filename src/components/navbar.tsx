import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faChartLine,
  faBookBookmark,
  faArrowUpFromBracket,
  faGear,
  faRightFromBracket,
  faUserPlus,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { logout } from "@/features/auth/api/logout";
import { useAuthStore } from "@/stores/authSlice";
import "./navbar.scss";
import { useImportStatusStore } from "@/stores/importStatus";
import Modal from "./modal";
import { useState } from "react";
import { register } from "./api/register";
import { findAllUsernames } from "./api/findAllUsernames";

function Navbar() {
  const user = useAuthStore((s) => s.user);
  const hasImportedToday = useImportStatusStore((s) => s.hasImportedToday);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState("User");
  const [existingUsernames, setExistingUsernames] = useState<string[]>([]);

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const validate = (usernameVal: string, passwordVal: string) => {
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    const passwordRegex = /^[a-zA-Z0-9]{8,20}$/;

    // add check duplicate username
    const duplicatedUsername = existingUsernames.find((u) => usernameVal == u);
    console.log(duplicatedUsername)
    if (duplicatedUsername) {
      setErrorMessage("This username was already taken");
      setIsValid(false);
      return;
    }

    if (!usernameRegex.test(usernameVal)) {
      setErrorMessage("Username must be 4-20 alphanumeric characters.");
      setIsValid(false);
      return;
    }

      if (!passwordRegex.test(passwordVal)) {
      setErrorMessage("Password must be 8-20 alphanumeric characters.");
      setIsValid(false);
      return;
    }

    setErrorMessage("");
    setIsValid(true);
  };

  const handleConfirmAddMember = async () => {
    const userPayload = {
      username: username,
      password: password,
      role: selectedRole,
    };

    await register(userPayload);
  };

  const handleCancelAddMember = () => {
    setUsername("");
    setPassword("");
    setErrorMessage("");
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
            <span
              className={`badge ${hasImportedToday ? "success" : "warning"}`}
            >
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
          <button
            title="AddUser"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#modal-create-user"
            onClick={async () => {
              const data = await findAllUsernames();
              setExistingUsernames(data);
            }}
          >
            <FontAwesomeIcon icon={faUserPlus} />
          </button>
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

      <Modal
        title="Create new user"
        id="create-user"
        confirmText="Create"
        cancelText="Cancel"
        onConfirm={handleConfirmAddMember}
        confirmDisabled={!isValid}
        onClose={handleCancelAddMember}
        size="modal-md"
      >
        <div className="create-new-user-modal-content row">
          <div className="col-6">
            <label className="form-label">
              Username{" "}
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="username-info-icon"
              />{" "}
              <span className="username-info">
                Username must be alphanumeric characters (a-z, A-Z, 0-9) with a
                length to be between 4 and 20 characters
              </span>
            </label>

            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                const value = e.target.value;
                setUsername(value);
                validate(e.target.value, password);
              }}
              value={username}
            />
          </div>
          <div className="col-6 dropdown-select">
            <select
              name=""
              id=""
              className="form-control"
              onChange={(e) => {
                setSelectedRole(e.target.value);
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="col-6">
            <label className="form-label">
              Password{" "}
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="password-info-icon"
              />{" "}
              <span className="password-info">
                Password must be alphanumeric characters (a-z, A-Z, 0-9) with a
                length to be between 8 and 20 characters
              </span>
            </label>

            <input
              type="text"
              className="form-control"
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);
                validate(username, e.target.value);
              }}
              value={password}
            />
          </div>
          <p className="input-error-msg">{errorMessage}</p>
        </div>
      </Modal>
    </>
  );
}

export default Navbar;
