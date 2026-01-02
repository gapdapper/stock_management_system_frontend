import AuthLayout from "@/components/layouts/auth-layout";
import LoginForm from "@/features/auth/components/login-form";
import { useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authSlice";

function Login() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/home");
  }

  const successHandler = (() => {
    setIsLoggedIn(true);
    setTimeout(() => {
      navigate("/home");
    }, 3000);
  })

  return (
    <>
      <AuthLayout>
        {!isLoggedIn ? (
          <LoginForm onLoginSuccess={() => {successHandler()}}/>
        ) : (
          <div className="login-form p-5">
            <h1>You are now logged in</h1>
            <h4 className="mb-3">You will be re-directed soon...</h4>
          </div>
        )}
      </AuthLayout>
    </>
  );
}

export default Login;
