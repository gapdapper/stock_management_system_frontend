import { useState } from "react";
import { login } from "@/features/auth/api/AuthService";
import { useAuthStore } from "@/stores/authSlice";
import "./login-form.scss";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="login-form p-5">
      <h1>Woodentoys4u</h1>
      <h2 className="mb-3">Stock Management System</h2>
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
        <label htmlFor="password" className="mb-1 fw-semibold">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          minLength={8}
          maxLength={20}
          className="form-control mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary" disabled={loading || !username || !password}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
