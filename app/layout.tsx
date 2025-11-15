import "./globals.css";

export const metadata = {
  title: "N-Device Manager",
  description: "Demo: Multi-device access control with Auth0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-generalSans antialiased bg-white text-neutral-900">
        {children}
      </body>
    </html>
  );
}
