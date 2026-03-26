import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "student" | "staff" | "admin";

export interface User {
  name: string;
  email: string;
  role: UserRole;
  id: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo accounts
const DEMO_USERS: Record<UserRole, { email: string; password: string; name: string }[]> = {
  student: [
    { email: "student@campus.edu", password: "student123", name: "Rahul Sharma" },
    { email: "priya@campus.edu", password: "student123", name: "Priya Patel" },
  ],
  staff: [
    { email: "staff@campus.edu", password: "staff123", name: "Dr. Meena Iyer" },
    { email: "tech@campus.edu", password: "staff123", name: "Suresh Kumar" },
  ],
  admin: [
    { email: "admin@campus.edu", password: "admin123", name: "Prof. Anand Rao" },
  ],
};

const STORAGE_KEY = "campusfix-auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, password: string, role: UserRole): boolean => {
    const accounts = DEMO_USERS[role];
    const match = accounts.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (match) {
      setUser({
        name: match.name,
        email: match.email,
        role,
        id: `${role}-${match.email}`,
      });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
