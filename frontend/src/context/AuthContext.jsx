import { createContext, useState, useEffect } from "react";
import API from "@/api";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const navigate = useNavigate();

  // Fetch user profile if token exists
  useEffect(() => {
    if (token) {
      API.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => setUser(res.data))
        .catch((err) => {
          console.error("Error fetching user profile:", err);
          setUser(null);
          setToken(null);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
        });
    }
  }, [token]);

  // Sync token and user to localStorage
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });
      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (name, email, password) => {
    try {
      const { data } = await API.post("/auth/signup", { name, email, password });
      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
