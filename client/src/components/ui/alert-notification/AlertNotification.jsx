import { useContext, useEffect } from "react"
import { AlertContext } from "../../../contexts/alert-context"

export default function AlertNotification() {
    const { alert, setAlert } = useContext(AlertContext);

    useEffect(() => {
        if (alert) {
            setTimeout(() => {
                setAlert(false);
            }, 2000)
        }
    }, [alert, setAlert])

    return <>
        <div className="error-notification">
            <div className="error-icon"></div>
            <div className="error-content">
                <p>Incorrect password. Please try again.</p>
            </div>
        </div>
    </>
}