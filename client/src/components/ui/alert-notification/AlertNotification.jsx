import { useContext, useEffect, useRef } from "react"
import { AlertContext } from "../../../contexts/alert-context"

export default function AlertNotification() {
    const { alert, setAlert } = useContext(AlertContext);
    const curTimeoutIdRef = useRef(null);

    useEffect(() => {
        if (alert) {
            if (curTimeoutIdRef.current) {
                clearTimeout(curTimeoutIdRef.current);
            }

            curTimeoutIdRef.current = setTimeout(() => {
                setAlert(false);
            }, 5000);
        }
    }, [alert, setAlert])

    return <>
        <div
            className="error-notification"
            data-testid="error-notification"
        >
            <div className="error-icon" data-testid="error-icon" />
            <div className="error-content" data-testid="error-content">
                <p>{alert}</p>
            </div>
        </div>
    </>
}