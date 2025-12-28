import { useState } from "react";
import AuthLayout from "@/app/components/layouts/auth-layout";
import "./login.scss";

function Login() {
    const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        console.log({
      username,
      password,
    });
  }

  return (
    <>
      <AuthLayout>
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
              className="form-control mb-5"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" disabled={!username || !password}>
              Login
            </button>
          </form>
        </div>
      </AuthLayout>
    </>
  );
}

export default Login;
