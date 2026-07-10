import Sidebar from "../../components/Sidebar";
import AuthGuard from "../../components/AuthGuard";

export default function AppLayout({ children }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 p-8 min-w-0">{children}</main>
      </div>
    </AuthGuard>
  );
}
