
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user was previously logged in
    const auth = localStorage.getItem('auth');
    if (auth) {
      setIsAuthenticated(true);
      setUser(localStorage.getItem('user'));
    }
  }, []);

  const login = (username: string, password: string) => {
    // Updated credentials
    if (username === 'SKA311772' && password === 'CSUkqt358003') {
      setIsAuthenticated(true);
      setUser(username);
      localStorage.setItem('auth', 'true');
      localStorage.setItem('user', username);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid username or password",
      });
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
