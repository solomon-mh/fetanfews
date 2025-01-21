import React, { createContext, useState, useContext, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import { CustomUser ,ChildrenProps} from "../utils/interfaces";
const AuthContext = createContext<{ user: CustomUser | null }>({ user: null });

export const useAuth = () => {
    return useContext(AuthContext);

}
export const AuthProvider:React.FC<ChildrenProps> = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try 
                {
                    const response = await getCurrentUser();
                    setUser(response.data)
    
    
                } catch (error) {
                    console.error("Token expired or invalid:", error);
    
                }
            }
            
        };
        fetchUser();
    }, [])
  console.log('Fetching user',user)
    return (
        <AuthContext.Provider value={{ user}}>
            {children}
        </AuthContext.Provider>
    )
    
}