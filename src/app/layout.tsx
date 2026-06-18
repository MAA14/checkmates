import React from "react";
import "./globals.css";

type THomeLayout = {
  children: React.ReactNode;
};
export default function HomeLayout({ children }: THomeLayout) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
