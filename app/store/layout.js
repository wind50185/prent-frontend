"use client";

import "../styles/store.scss";
import { CartProvider } from "@/contexts/cart-context";

export default function Layout({ children }) {
  return (
    <>
      <CartProvider>{children}</CartProvider>
    </>
  );
}
