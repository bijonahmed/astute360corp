"use client"; // must be client for localStorage and router

import Script from "next/script";
import AdminNavbar from "../components/admin/AdminNavbar";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminFooter from "../components/admin/AdminFooter";
import { AuthProvider } from "../context/AuthContext";
import AdminAssets from "../components/admin/AdminAssets";
import { useState, useEffect } from "react"; 
import { useRouter } from "next/navigation";
import Head from "next/head";

export default function AdminLayout({ children }) {

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    document.title = "Dashboard";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");  
    if (!token) {
      router.replace("/login");  
    } else {
      setLoading(false);  
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;  

  return (

    <AuthProvider>
      <div className="app-wrapper">
        <AdminAssets />
        <AdminNavbar />
        <AdminSidebar />
        <AdminFooter />
        {children}
      </div>
    </AuthProvider>

  );
}