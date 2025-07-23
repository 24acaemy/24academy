"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, User } from "../services/firebase"; // Import Firebase's User type from firebase/auth

// Type definition for user state
type UserT = {
    user: User | null; // Use Firebase's User type
    isLogin: boolean;
};

// Create the context with a default value
const Context = createContext<{
    user: UserT;
    setUser: React.Dispatch<React.SetStateAction<UserT>>;
}>({
    user: { user: null, isLogin: false }, // Default state
    setUser: () => {
        throw new Error("setUser function must be overridden by AuthProvider");
    }, // Throw an error if used outside the provider
});

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<UserT>({ user: null, isLogin: false });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(
            (userState) => {
                setUser({ isLogin: userState ? true : false, user: userState });
                setLoading(false);
            },
            (error) => {
                alert(`Authentication state change error: ${error}`);
                setLoading(false);
            }
        );

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return (
        <Context.Provider value={{ user, setUser }}>
            {loading ? (
                <div className="h-screen flex w-full justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                children
            )}
        </Context.Provider>
    );
};

// Custom hook to access context
export const useAuthContext = () => useContext(Context);

export default AuthProvider;
