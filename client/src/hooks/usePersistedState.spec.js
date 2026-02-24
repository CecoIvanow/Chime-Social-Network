import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import usePersistedState from "./usePersistedState";

const locaStorageMock = {
    getItem: vi.spyOn(Storage.prototype, "getItem"),
    removeItem: vi.spyOn(Storage.prototype, "removeItem"),
    setItem: vi.spyOn(Storage.prototype, "setItem"),
};

describe("usePersistedState tests", () => {
    it("manually sets persisted user information on user login", async () => {
        const testParams = {
            userData: "userId",
            get persistedData() {
                return JSON.stringify(this.userData);
            },
        };

        const { result } = renderHook(() => {
            const [state, setPersistedState] = usePersistedState();

            return { state, setPersistedState };
        });

        await act(async () => {
            result.current.setPersistedState(testParams.userData);
        });

        expect(locaStorageMock.setItem).toHaveBeenCalledWith("user", testParams.persistedData);
        expect(result.current.state).toBe(testParams.userData);
    });

    it("manually removes persisted user information on logout", async () => {
        const testParams = {
            userData: null,
        };

        const { result } = renderHook(() => {
            const [state, setPersistedState] = usePersistedState();

            return { state, setPersistedState };
        });

        await act(async () => {
            result.current.setPersistedState(testParams.userData);
        });

        expect(locaStorageMock.setItem).not.toHaveBeenCalled();

        expect(locaStorageMock.removeItem).toHaveBeenCalledWith("user");
        expect(result.current.state).toBe(testParams.userData);
    });

    it("sets initial user persisted information on mount", async () => {
        const testParams = {
            initialData: "userId",
        };
        locaStorageMock.getItem.mockReturnValue(null);

        const { result } = renderHook(() => {
            const [state, setPersistedState] = usePersistedState(testParams.initialData);

            return { state, setPersistedState };
        });

        expect(locaStorageMock.getItem).toHaveBeenCalledWith("user");
        expect(result.current.state).toBe(testParams.initialData);
    });

    it("sets initial user persisted information on mount", async () => {
        const testParams = {
            get initialData() {
                return JSON.stringify("userId");
            },
            newUserData: "newUserData"
        };
        locaStorageMock.getItem.mockReturnValue(testParams.initialData);

        const { result } = renderHook(() => {
            const [state, setPersistedState] = usePersistedState(testParams.newUserData);

            return { state, setPersistedState };
        });

        expect(locaStorageMock.getItem).toHaveBeenCalledWith("user");
        expect(result.current.state).toBe(JSON.parse(testParams.initialData));
    });
});