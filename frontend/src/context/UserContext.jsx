import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);  // Initialize with null instead of an empty array
    const [isAuth, setIsAuth] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Register a new user
    async function registerUser(name, email, password, navigate, fetchPins) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/user/register", { name, email, password });
            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            fetchPins();
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            setBtnLoading(false);
        }
    }

    // Log in an existing user
    async function loginUser(email, password, navigate, fetchPins) {
        setBtnLoading(true);
        try {
            const { data } = await axios.post("/api/user/login", { email, password });
            toast.success(data.message);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
            fetchPins();
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            setBtnLoading(false);
        }
    }

    // Fetch user data
    async function fetchUser() {
        try {
            const { data } = await axios.get("/api/user/me/");
            setUser(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    async function followUser(id, fetchUser) {
        try {
          const { data } = await axios.post("/api/user/follow/" + id);
    
          toast.success(data.message);
          fetchUser();
        } catch (error) {
          toast.error(error.response.data.message);
        }
      }
      
    

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ loginUser, btnLoading, isAuth, user, loading, registerUser, setIsAuth, setUser, followUser }}>
            {children}
            <Toaster />
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);
