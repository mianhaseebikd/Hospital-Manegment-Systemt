import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api.js";

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  const persistSession = useCallback(({ user: nextUser, role: nextRole, hospital: nextHospital, accessToken, refreshToken }) => {
    setUser(nextUser);
    setRole(nextRole);
    setHospital(nextHospital);
    localStorage.setItem("hms_access_token", accessToken || "dummy-admin-session");
    localStorage.setItem("hms_refresh_token", refreshToken || "dummy-admin-refresh");
  }, []);

  const registerAdmin = useCallback(async (body) => {
    const data = await api.registerAdmin(body);
    persistSession(data);
    return data;
  }, [persistSession]);

  const loginAdmin = useCallback(async (email) => {
    const data = await api.loginAdmin({ email });
    persistSession(data);
    return data;
  }, [persistSession]);

  const updateLocalHospital = useCallback((nextHospital) => {
    setHospital(nextHospital);
  }, []);

  const updateLocalUser = useCallback((nextUser) => {
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setRole(null);
    setHospital(null);
    localStorage.removeItem("hms_access_token");
    localStorage.removeItem("hms_refresh_token");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("hms_access_token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .getMe()
      .then(persistSession)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout, persistSession]);

  const value = useMemo(
    () => ({
      user,
      role,
      hospital,
      loading,
      registerAdmin,
      loginAdmin,
      updateLocalHospital,
      updateLocalUser,
      logout,
      isAuthenticated: Boolean(user)
    }),
    [user, role, hospital, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
