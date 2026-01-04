import './auth-layout.scss'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-layout">
    {children}
    </div>;
}
