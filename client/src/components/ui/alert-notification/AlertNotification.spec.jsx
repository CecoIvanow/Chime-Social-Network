import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AlertNotification from "./AlertNotification";

import { AlertContext } from "../../../contexts/alert-context";

const alertCtxProps = {
    alert: 'Alert message!',
    setAlert: vi.fn(),
}

function setup(options = {
    includeAlertMessage: true
}) {
    const alertMessage = options.includeAlertMessage ? alertCtxProps.alert : null;

    vi.useFakeTimers();

    const { rerender } = render(
        <AlertContext.Provider value={{ alert: alertMessage, setAlert: alertCtxProps.setAlert }}>
            <AlertNotification />
        </AlertContext.Provider>
    );

    return { rerender };
}

describe('AlertNotification component', () => {
    it.each([
        { name: 'renders alert message on set alert', shouldRender: true },
        { name: 'does not render alert message on not set alert', shouldRender: false }
    ])('$name', ({ shouldRender }) => {
        setup({
            includeAlertMessage: shouldRender,
        });

        if (shouldRender) {
            expect(screen.getByText(alertCtxProps.alert)).toBeInTheDocument();
        } else {
            expect(screen.queryByText(alertCtxProps.alert)).not.toBeInTheDocument();
        }
    });

    it('triggers setAlert with null and clears the alert after 5000ms', () => {
        setup();

        vi.advanceTimersByTime(4999);
        expect(alertCtxProps.setAlert).not.toHaveBeenCalled();
        expect(screen.getByText(alertCtxProps.alert)).toBeInTheDocument();

        vi.advanceTimersByTime(1);
        expect(alertCtxProps.setAlert).toHaveBeenCalledTimes(1);
        expect(alertCtxProps.setAlert).toHaveBeenCalled(null);
    });

    it('updates alert with correct value when new alert is set', () => {
        const { rerender } = setup();

        const newAlert = 'Second error';

        vi.advanceTimersByTime(2000);
        rerender(
            <AlertContext.Provider value={{ alert: newAlert, setAlert: alertCtxProps.setAlert }}>
                <AlertNotification />
            </AlertContext.Provider>
        )

        vi.advanceTimersByTime(2000);
        expect(screen.getByText(newAlert)).toBeInTheDocument();
    })

    it('does not reset timer when alert changes from value to null', () => {
        const { rerender } = render(
            <AlertContext.Provider value={alertCtxProps}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(2000);

        rerender(
            <AlertContext.Provider value={{ alert: null, setAlert: alertCtxProps.setAlert }}>
                <AlertNotification />
            </AlertContext.Provider>
        )

        vi.advanceTimersByTime(5000);
        expect(alertCtxProps.setAlert).toBeCalledTimes(1);
    })
})