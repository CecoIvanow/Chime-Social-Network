import { Navigate, Outlet } from "react-router";
import { useContext } from "react";

import { UserContext } from "../../contexts/user-context";

export default function GuestGuard() {
    const { loggedInUserId } = useContext(UserContext);

    if (loggedInUserId) {
        return <Navigate to={"/"} />
    }

    return <Outlet />;
};