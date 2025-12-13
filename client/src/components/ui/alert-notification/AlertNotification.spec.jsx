import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AlertNotification from "./AlertNotification";

import { AlertContext } from "../../../contexts/alert-context";

describe('AlertNotification component', () => {
    it('Component should render with truthy value', () => {
        render(
            <AlertContext.Provider value={{ alert: 'Something broke!', setAlert: vi.fn() }}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        expect(screen.getByTestId('error-notification')).toNotBeInTheDocument();
        expect(screen.getByTestId('error-icon')).toBeInTheDocument();
        expect(screen.getByTestId('error-content')).toBeInTheDocument();
        expect(screen.getByText('Something broke!')).toBeInTheDocument();
    });

    it('setAlert should not be called with a falsy value', () => {
        const setAlertMock = vi.fn();

        render(
            <AlertContext.Provider value={{ alert: false, setAlert: setAlertMock }}>
                <AlertNotification />
            </AlertContext.Provider>
        )

        expect(setAlertMock).not.toHaveBeenCalled();
    })

    it('Alert context should be set to false after 5000 ms', () => {
        const setAlertMock = vi.fn();
        vi.useFakeTimers();

        render(
            <AlertContext.Provider value={{ alert: 'Something broke!', setAlert: setAlertMock }}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(4999);
        expect(setAlertMock).toBeCalledTimes(0);
        expect(screen.getByText('Something broke!')).toBeInTheDocument();

        vi.advanceTimersByTime(1);
        expect(setAlertMock).toBeCalledTimes(1);
        expect(setAlertMock).toBeCalledWith(false);
    });

    it('Alert message should change with different passed props', () => {
        const setAlertMock = vi.fn();
        vi.useFakeTimers();

        const { rerender } = render(
            <AlertContext.Provider value={{ alert: 'First error', setAlert: setAlertMock }}>
                <AlertNotification />
            </AlertContext.Provider>
        );

        vi.advanceTimersByTime(2000);

        rerender(
            <AlertContext.Provider value={{ alert: 'Second error', setAlert: setAlertMock }}>
                <AlertNotification />
            </AlertContext.Provider>
        )

        vi.advanceTimersByTime(2000);
        expect(setAlertMock).not.toHaveBeenCalled();
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