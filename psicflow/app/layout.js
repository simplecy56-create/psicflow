import "./globals.css";

export const metadata = {
  title: "PsicFlow",
  description: "Sistema para psicólogos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
