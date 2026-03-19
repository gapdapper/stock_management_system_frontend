import LoginForm from "@/features/auth/components/login-form";
import '@/features/auth/login.scss'

export default function Login() {
  return (
      <div className="auth-layout">
        <div className="auth-img"></div>
        <div className="auth-login">
        <LoginForm />
        </div>
      </div>
  );
}
