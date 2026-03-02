import { Navigate, Outlet } from "react-router";
import { useContext } from "react";

import { UserContext } from "../contexts/user-context";

export default function AuthGuard() {
    const { loggedInUserId } = useContext(UserContext);

    if (!loggedInUserId) {
        return <Navigate to={"/login"}/>
    }
    
    return (
        <Outlet />
    );
};