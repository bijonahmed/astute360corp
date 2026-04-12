//"use client";

import ClientNavbar from "../components/frontend/ClientNavbar";
import ClientFooter from "../components/frontend/ClientFooter";
import { AuthProvider } from "../context/AuthContext";
import FrontendAssets from "../components/frontend/FrontendAssets";
import FooterMobileMenu from "../components/frontend/FooterMobileMenu";
import { CartProvider } from "../context/CartContext";
//export const metadata = { title: "Astute360corp - Your trusted technology solutions provider" };

export default function PublicLayout({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FrontendAssets />
        <ClientNavbar />
        <main>{children}</main>
        <ClientFooter />
      </CartProvider>
    </AuthProvider>
  );
}
