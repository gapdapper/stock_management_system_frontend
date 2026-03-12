import { useState } from "react";
import { login } from "@/features/auth/api/AuthService";
import { useAuthStore } from "@/stores/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faKey } from "@fortawesome/free-solid-svg-icons";
import "./login-form.scss";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isShowForgetPassword, setIsShowForgetPassword] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accessToken = await login(username.trim(), password.trim());
      setToken(accessToken);
    } catch (err) {
      alert("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  if (!isShowForgetPassword) return (
    <div className="login-container">
      <div className="form-icon">
      <FontAwesomeIcon icon={faCubes} />
      </div>
      <h4 className="mb-0">Sign In</h4>
      <p>Stock Management System</p>
      <form action="" className="form" onSubmit={handleLogin}>
        <label htmlFor="username" className="mb-1 fw-semibold">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          minLength={4}
          maxLength={20}
          className="form-control mb-3"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="password-label">
        <label htmlFor="password" className="mb-1 fw-semibold">
          Password
        </label>
          <a className="forget-password-btn" onClick={() => {setIsShowForgetPassword(!isShowForgetPassword)}}>
            Forget password?
          </a>
        </div>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          minLength={8}
          maxLength={20}
          className="form-control mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading || !username || !password}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      </div>

  );

  else { return (
      <div className="forget-password-container">
      <div className="form-icon">
      <FontAwesomeIcon icon={faKey} />
      </div>
        <h4 className="mb-2">Reset Password</h4>
        <label htmlFor="username" className="fw-semibold">
          Email Address
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your email address"
          minLength={4}
          maxLength={20}
          className="form-control mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn btn-primary">Send an email</button>
        <a onClick={() => {setIsShowForgetPassword(!isShowForgetPassword)}}>⟵ Back to Login</a>
      </div>
  )
  }
}

export default LoginForm;
