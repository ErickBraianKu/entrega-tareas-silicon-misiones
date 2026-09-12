import "./globals.css";

export const metadata = {
  title: "Memory Game",
  description: "Juego de memoria hecho con Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
