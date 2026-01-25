import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AlertNotification from "./AlertNotification";

import { AlertContext } from "../../../contexts/alert-context";

const alertCtxProps = {
    alert: "Alert message!",
    setAlert: vi.fn(),
}

function setup(options = {
    includeAlertMessage: true
}) {
    const alertMessage = options.includeAlertMessage ? alertCtxProps.alert : null;

    const { rerender } = render(
        <AlertContext.Provider value={{ alert: alertMessage, setAlert: alertCtxProps.setAlert }}>
            <AlertNotification />
        </AlertContext.Provider>
    );

    return { rerender };
}

describe('AlertNotification component', () => {
    it.each([
        { name: "renders alert message on set alert", shouldRender: true },
        { name: "does not render alert message on not set alert", shouldRender: false }
    ])("$name", ({ shouldRender }) => {
        setup({
            includeAlertMessage: shouldRender,
        });

        if (shouldRender) {
            expect(screen.getByText(alertCtxProps.alert)).toBeInTheDocument();
        } else {
            expect(screen.queryByText(alertCtxProps.alert)).not.toBeInTheDocument();
        }
    });

    it('Alert context should be set to false after 5000 ms', () => {
        vi.useFakeTimers();
        setup();

        vi.advanceTimersByTime(4999);
        expect(alertCtxProps.setAlert).toBeCalledTimes(0);
        expect(screen.getByText(alertCtxProps.alert)).toBeInTheDocument();

        vi.advanceTimersByTime(1);
        expect(alertCtxProps.setAlert).toBeCalledTimes(1);
        expect(alertCtxProps.setAlert).toBeCalledWith(false);
    });

    it('Alert message should change with different passed props', () => {
        vi.useFakeTimers();

        const { rerender } = setup();

        vi.advanceTimersByTime(2000);

        rerender(
            <AlertContext.Provider value={{ alert: 'Second error', setAlert: alertCtxProps.setAlert }}>
                <AlertNotification />
            </AlertContext.Provider>
        )

        vi.advanceTimersByTime(2000);
        expect(alertCtxProps.setAlert).not.toHaveBeenCalled();
        expect(screen.getByText('Second error')).toBeInTheDocument();
    })

    it("Alert timer should't change on falsy alert value", () => {
        const setAlertMock = vi.fn();
        vi.useFakeTimers();

        const { rerender } = render(
            <AlertContext.Provider value={{ alert: 'First error', setAlert: setAlertMock }}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(2000);

        rerender(
            <AlertContext.Provider value={{ alert: false, setAlert: setAlertMock }}>
                <AlertNotification />
            </AlertContext.Provider>
        )

        vi.advanceTimersByTime(5000);
        expect(setAlertMock).toBeCalledTimes(1);
    })
})