import LoginForm from "@/features/auth/components/login-form";
import '@/features/auth/login.scss'

export default function Login() {
  return (
      <div className="auth-layout">
        <LoginForm />
      </div>
  );
}
