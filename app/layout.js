
// app/_layout.tsx (for TypeScript)
import React from "react";
import AdminLayout from "./components/AdminLayout"; // Assuming AdminLayout is in components

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Dashboard</title>
      </head>
      <body>
        <AdminLayout>{children}</AdminLayout>
      </body>
    </html>
  );
}
