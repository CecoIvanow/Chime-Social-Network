import { describe, expect, it, vi } from "vitest";

import api from "./api";

window.fetch = vi.fn();

const pathname = '/posts';
const FULL_PATH = `http://localhost:4012${pathname}`;

const fetchBodyValue = "This is the fetch response!";

function fetchSetup(options = {
    respBodyPresense: false,
    method: "GET",
    fetchOptions: {}
}) {
    const headersOptions = {};
    let resp;

    if (options.respBodyPresense) {
        headersOptions.headers = {
            "Content-type": "application/json",
        };
        resp = new Response(JSON.stringify(fetchBodyValue), headersOptions);
    } else {
        headersOptions.headers = {
            "Content-type": "",
        };
        resp = new Response(null, headersOptions);
    }

    window.fetch.mockResolvedValue(resp);

    const fetchOptionsObj = {
        ...options.fetchOptions,
        method: options.method,
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include'
    }

    return fetchOptionsObj
}

describe("API util tests", () => {
    it("makes a basic GET fetch request with url and no options", async () => {
        const fetchOptions = fetchSetup();

        await api.get(pathname);
        expect(window.fetch).toHaveBeenCalledWith(FULL_PATH, fetchOptions);
    });
});