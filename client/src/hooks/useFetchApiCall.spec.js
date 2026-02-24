import React from "react";

import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import api from "../utils/api";

import { AlertContext } from "../contexts/alert-context";

import useFetchApiCall from "./useFetchApiCall";

vi.mock("../utils/api.js", () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        patch: vi.fn(),
        delete: vi.fn(),
    }
}));

const setAlert = vi.fn();

const alertContextWrapper = ({ children }) => React.createElement(AlertContext.Provider, { value: { setAlert, } }, children);

describe("useFetchApiCall tests", () => {
    it("calls api.get when given a url and the method is GET", async () => {
        const { result } = renderHook(() => useFetchApiCall(), { wrapper: alertContextWrapper });

        const testParams = {
            url: "https://www.example.com",
            method: "GET",
            get signal() {
                const abortController = new AbortController();
                const signal = abortController.signal;

                return { signal };
            }
        };

        await act(async () => {
            await result.current.fetchExecute(testParams.url, testParams.method);
        });

        expect(api.get).toHaveBeenCalledWith(testParams.url, testParams.signal);
    });
});