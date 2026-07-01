import "./globals.css";
import Sidebar from "../components/Sidebar";

export const metadata = {
  title: "PsicFlow",
  description: "Sistema para psicólogos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 p-8 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
