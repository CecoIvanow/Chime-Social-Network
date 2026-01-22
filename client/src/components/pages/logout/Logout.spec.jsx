import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import Logout from "./Logout";

import { AlertContext } from "../../../contexts/alert-context";

vi.mock("../../../hooks/useUserServices", () => ({
    default: () => ({
        logout: logoutMock
    })
}));

const LOGOUT_ERR_MSG = "Successfully rejected logout call!";

const logoutMock = vi.fn();

const setAlert = vi.fn();

function setup(options = {
    logoutRejectedCall: false
}) {

    options.logoutRejectedCall ?
    logoutMock.mockRejectedValue(new Error(LOGOUT_ERR_MSG)) :
    logoutMock.mockResolvedValue();

    render(
        <AlertContext.Provider value={{ setAlert }}>
            <Logout />
        </AlertContext.Provider>
    );
}

describe("Logout component", () => {
    it("triggers logout on initial render", () => {
        setup();

        expect(logoutMock).toHaveBeenCalled();
    });

    it("triggers setAlert on rejected call", async () => {
        setup({
            logoutRejectedCall: true
        });

        await waitFor(() => {
            expect(setAlert).toHaveBeenCalledWith(LOGOUT_ERR_MSG);
        })
    });
});