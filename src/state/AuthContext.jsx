import React, { createContext, useContext, useEffect, useState } from "react";

const AuthCtx = createContext(null);

const API_BASE = "http://127.0.0.1:8000"; // backend

function getToken() {
  return localStorage.getItem("token");
}
function setToken(t) {
  localStorage.setItem("token", t);
}
function clearToken() {
  localStorage.removeItem("token");
}

async function api(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed");
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api("/api/auth/me");
      setUser(me.user);
    } catch {
      clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email, password) {
    try {
      const data = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      await refresh();
    } catch {
      // Auto-register for fast testing
      const data = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      await refresh();
    }
  }

  async function register(email, password) {
    const data = await api("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    await refresh();
  }

  async function logout() {
    clearToken();
    setUser(null);
  }

  async function setRole(role, reason = "") {
    try {
      const data = await api("/api/auth/set-role", {
        method: "POST",
        body: JSON.stringify({ role, reason }),
      });
      // Refresh user data to get updated role
      await refresh();
      return data; // Return data so caller can check if it's a request
    } catch (error) {
      // If it's a 400 error with a message, that's okay (pending request)
      if (error.message && error.message.includes("pending")) {
        await refresh();
        return { message: error.message, user: user };
      }
      throw error;
    }
  }

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, setRole }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
