import AuthLayout from "@/components/layouts/auth-layout";
import LoginForm from "@/features/auth/components/login-form";
import { useEffect, useState } from "react";
import "./login.scss";
import { useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authSlice";
import { refreshToken } from "@/lib/auth";

function Login() {
  return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
  );
}

export default Login;
