import React, {createContext, useContext, useState, useEffect}from "react";

const AuthContext = createContext();
 export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
 
export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try{
             const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
           const userData = JSON.parse(userStr);
           setUser(userData);
           setIsAuthenticated(true);
        }
        }catch(err){
            console.error("Error checking auth status:", err);
            logout();
        }finally {
            setLoading(false);
       }      
    };

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = "/";
    };

    const updateUser = (updatedData) => {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

   const value = {
    user,
    loading,
    isAuthenticated,
    checkAuthStatus, 
    login,
    logout,
    updateUser
   }    

   return (
    <AuthContext.Provider value={value} >{children}</AuthContext.Provider>
   )
  
};