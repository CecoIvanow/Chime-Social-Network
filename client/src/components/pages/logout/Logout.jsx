import { useEffect } from "react";

import useUserServices from "../../../hooks/useUserServices";

export default function Logout() {
    const { logout } = useUserServices();

    useEffect(() => {
        logout()
            .catch(error => console.error(error.message));
    }, [logout])
}