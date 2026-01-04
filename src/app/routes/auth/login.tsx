import AuthLayout from "@/components/layouts/auth-layout";
import LoginForm from "@/features/auth/components/login-form";

export default function Login() {
  return (
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
  );
}
