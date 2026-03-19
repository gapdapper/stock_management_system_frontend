import LoginForm from "@/features/Auth/components/login-form";
import '@/features/Auth/login.scss'

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
