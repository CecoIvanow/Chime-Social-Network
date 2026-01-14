import { useContext, useEffect } from "react";

import useUserServices from "../../../hooks/useUserServices";

import { AlertContext } from "../../../contexts/alert-context";

export default function Logout() {
    const { logout } = useUserServices();
    const { setAlert } = useContext(AlertContext);

    useEffect(() => {
        logout()
            .catch(error => {
                console.error(error);
                setAlert(error.message);
            });
    }, [logout, setAlert])
}