import { render, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AlertContext } from "../../../contexts/alert-context";

import Logout from "./Logout";

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        logout,
    })
}));

const LOGOUT_ERR_MSG = "Successfully rejected logout call!";

const logout = vi.fn();

const setAlert = vi.fn();

function setup(options = {
    logoutRejectedCall: false
}) {

    options.logoutRejectedCall ?
    logout.mockRejectedValue(new Error(LOGOUT_ERR_MSG)) :
    logout.mockResolvedValue();

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <Logout />
        </AlertContext.Provider>
    );
}

describe("Logout component", () => {
    it("logs out user when called", () => {
        setup();

        expect(logout).toHaveBeenCalled();
    });

    it("shows error message on a failed logout call", async () => {
        setup({
            logoutRejectedCall: true
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(LOGOUT_ERR_MSG);
        })
    });
});