import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { AlertContext } from "../../../contexts/alert-context";

import AlertNotification from "./AlertNotification";

const alertContextMock = {
    alert: "Alert message!",
    setAlert: vi.fn(),
}

function setup(options = {
    includeAlertMessage: true
}) {
    vi.useFakeTimers();

    const alertMessage = options.includeAlertMessage ? alertContextMock.alert : null;

    return render(
        <AlertContext.Provider value={{ alert: alertMessage, setAlert: alertContextMock.setAlert }}>
            <AlertNotification />
        </AlertContext.Provider>
    );
;}

describe("AlertNotification component", () => {
    it.each([
        { name: "renders alert message on an error", shouldRender: true },
        { name: "does not render alert message when no error is set", shouldRender: false }
    ])("$name", ({ shouldRender }) => {
        setup({
            includeAlertMessage: shouldRender,
        });

        if (shouldRender) {
            expect(screen.getByText(alertContextMock.alert)).toBeInTheDocument();
        } else {
            expect(screen.queryByText(alertContextMock.alert)).not.toBeInTheDocument();
        }
    });

    it("removes the alert message after 5000ms", () => {
        setup();

        vi.advanceTimersByTime(4999);
        expect(alertContextMock.setAlert).not.toHaveBeenCalled();
        expect(screen.getByText(alertContextMock.alert)).toBeInTheDocument();

        vi.advanceTimersByTime(1);
        expect(alertContextMock.setAlert).toHaveBeenCalledTimes(1);
        expect(alertContextMock.setAlert).toHaveBeenCalled(null);
    });

    it("updates the alert message when a new alert is set", () => {
        const { rerender } = setup();

        const newAlert = "Second error";

        vi.advanceTimersByTime(2000);
        rerender(
            <AlertContext.Provider value={{ alert: newAlert, setAlert: alertContextMock.setAlert }}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(2000);
        expect(screen.getByText(newAlert)).toBeInTheDocument();
    });

    it("does not reset 5000ms timeout when alert is cleared beforehand", () => {
        const { rerender } = render(
            <AlertContext.Provider value={alertContextMock}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(2000);

        rerender(
            <AlertContext.Provider value={{ alert: null, setAlert: alertContextMock.setAlert }}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(5000);
        expect(alertContextMock.setAlert).toBeCalledTimes(1);
    });
});