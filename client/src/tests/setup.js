import { beforeEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

beforeEach(() => {
    vi.resetAllMocks();
    vi.clearAllTimers();
    vi.spyOn(window.console, "error").mockImplementation(() => undefined);
});