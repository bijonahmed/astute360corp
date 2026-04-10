"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const router = useRouter();
  const [token, setToken] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("token") || null;
    return null;
  });
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined")
      return localStorage.getItem("username") || null;
    return null;
  });
  const [roles, setRoles] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("roles");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [permissions, setPermissions] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("permissions");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [loading, setLoading] = useState(true);
  // Initialize auth state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("token");
      const savedUser = localStorage.getItem("username");
      const savedRoles = localStorage.getItem("roles");
      const savedPermissions = localStorage.getItem("permissions");
      if (savedToken) {
        setToken(savedToken);
        setUsername(savedUser || null);
        setRoles(savedRoles ? JSON.parse(savedRoles) : []);
        setPermissions(savedPermissions ? JSON.parse(savedPermissions) : []);
        setIsLoggedIn(true);
      } else {
        setToken(null);
        setUsername(null);
        setRoles([]);
        setPermissions([]);
        setIsLoggedIn(false);
      }
    }
    setLoading(false);
  }, []);
  // Login method
  const login = (newToken, user, userRoles = [], userPermissions = []) => {
    localStorage.setItem("token", newToken.trim());
    localStorage.setItem("username", user);
    localStorage.setItem("roles", JSON.stringify(userRoles));
    localStorage.setItem("permissions", JSON.stringify(userPermissions));
    setToken(newToken);
    setUsername(user);
    setRoles(userRoles);
    setPermissions(userPermissions);
    setIsLoggedIn(true);
  };
  // Logout method
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("roles");
    localStorage.removeItem("permissions");
    setToken(null);
    setUsername(null);
    setRoles([]);
    setPermissions([]);
    setIsLoggedIn(false);
    router.push("/login");
  };
  // Protect route
  const protectRoute = () => {
    if (!isLoggedIn && !loading) {
      router.push("/login");
    }
  };
  // Role & permission helpers
  const hasRole = (roleName) => roles.includes(roleName);
  const hasPermission = (permissionName) =>
    permissions.includes(permissionName);
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        username,
        token,
        roles,
        permissions,
        login,
        logout,
        loading,
        protectRoute,
        hasRole,
        hasPermission,
      }}
    >
      {/* {loading ? <div>Loading...</div> : children} */}
       {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);