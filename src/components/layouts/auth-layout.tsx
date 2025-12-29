import './auth-layout.scss'

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="auth-layout">
    {children}
    </div>;
}

export default AuthLayout;
