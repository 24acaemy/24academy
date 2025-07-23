"use client"; // Ensure client-side behavior for Next.js

import { HOME_ROUTE, LOGIN_ROUTE, PROFILE_ROUTE, REGISTER_ROUTE } from "@/constants/routes";
import { useAuthContext } from "@/provider/AuthProvider"; // Correct import for the hook
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const GUEST_ROUTES = [HOME_ROUTE, REGISTER_ROUTE, LOGIN_ROUTE];

const useAuthentication = () => {
    const { user } = useAuthContext(); // Correctly access user context
    const userInfo = user || null;
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const currentRoute = window.location.pathname;

            if (!userInfo && !GUEST_ROUTES.includes(currentRoute)) {
                router.push(LOGIN_ROUTE); // Redirect if user is not authenticated
            }

            if (userInfo && GUEST_ROUTES.includes(currentRoute)) {
                router.push(PROFILE_ROUTE); // Redirect if user is authenticated and on guest route
            }
        }
    }, [userInfo, router]); // Watch userInfo to trigger the effect when authentication status changes
};

export default useAuthentication;
