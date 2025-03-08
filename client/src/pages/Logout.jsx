import { useEffect } from "react";
import userServices from "../services/user-services";

export default function Logout({
    setIsUser
}) {

    useEffect(() => {
        userServices.handleLogout(setIsUser)
        .catch(error => console.error(error.message));
    }, [setIsUser])
}