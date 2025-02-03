import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import { CustomUser, ChildrenProps } from "../utils/interfaces";

const AuthContext = createContext<{
  user: CustomUser | null;
  loggedin: boolean;
  setLoggedin: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  loggedin: false,
  setLoggedin: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedin, setLoggedin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const response = await getCurrentUser();
          setUser(response.data);
          setLoggedin(true); 
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.error("Token expired or invalid:", error);
          setLoggedin(false);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, loggedin, setLoggedin }}>
      {children}
    </AuthContext.Provider>
  );
};
