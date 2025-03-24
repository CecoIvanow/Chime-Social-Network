import { useContext, useEffect } from "react";

import userServices from "../../../services/user-services";

import { UserContext } from "../../../contexts/user-context";

export default function Logout() {
    const { setIsUser } = useContext(UserContext)

    useEffect(() => {
        userServices.handleLogout(setIsUser)
            .catch(error => console.error(error.message));
    }, [setIsUser])
}