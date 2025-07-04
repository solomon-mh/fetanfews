import React, { createContext, useState, useContext, useEffect } from "react";
// import { getCurrentUser } from "../api/auth";
import { CustomUser, ChildrenProps } from "../utils/interfaces";

const AuthContext = createContext<{
  user: CustomUser | null;
  setUser: React.Dispatch<React.SetStateAction<CustomUser | null>>;
}>({
  user: null,
  setUser: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [user, setUser] = useState<CustomUser | null>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     // const token = localStorage.getItem("access_token");
  //     const storedUser = localStorage.getItem("user");
  //     if (storedUser) {
  //       setUser(JSON.parse(storedUser)); //cached user for faster loading
  //     }

  //     // if (token) {
  //     //   try {
  //     //     // const response = await getCurrentUser();
  //     //     setUser(response.data);
  //     //     localStorage.setItem("user", JSON.stringify(response.data));
  //     //   } catch (error) {
  //     //     console.error("Token expired or invalid:", error);

  //     //     localStorage.removeItem("user");
  //     //     setUser(null);
  //     //   }
  //     // } else {
  //     //   setUser(null);
  //     //   localStorage.removeItem("user");
  //     // }
  //   };

  //   fetchUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
