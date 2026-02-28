import { describe, expect, it, vi } from "vitest";

import api from "./api";

window.fetch = vi.fn();

const fetchBody = {
    post: {
        _id: "14324",
        content: "This is a test!",
    },
};

const pathname = `/posts/${fetchBody.post._id}`;
const FULL_PATH = `http://localhost:4012${pathname}`;

function fetchSetup(options = {
    responceBody: null,
    method: "GET",
    options: {},
    requestBody: null,
}) {
    const headersOptions = {};
    let resp;

    if (options.requestBody) {
        options.options.body = JSON.stringify(options.requestBody);

        headersOptions.headers = {
            "Content-type": "application/json",
        };
        resp = new Response(JSON.stringify(fetchBody), headersOptions);
    }
    
    if (options.responceBody) {
        headersOptions.headers = {
            "Content-type": "application/json",
        };
        resp = new Response(JSON.stringify(fetchBody), headersOptions);
    } else {
        headersOptions.headers = {
            "Content-type": "",
        };
        resp = new Response(null, headersOptions);
    }

    window.fetch.mockResolvedValue(resp);

    const fetchOptionsObj = {
        ...options.options,
        method: options.method,
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include',
    };

    return {
        fetchOptions: fetchOptionsObj,
    };
};

describe("API util tests", () => {
    it("makes a basic GET fetch request", async () => {
        const { fetchOptions } = fetchSetup();

        await api.get(pathname);
        expect(window.fetch).toHaveBeenCalledWith(FULL_PATH, fetchOptions);
    });

    it("makes a basic PUT fetch request", async () => {
        const { fetchOptions } = fetchSetup({
            responceBody: null,
            options: {},
            method: "PUT",
            requestBody: fetchBody
        });

        await api.put(pathname, fetchBody);
        expect(window.fetch).toHaveBeenCalledWith(FULL_PATH, fetchOptions);
    });

    it("makes a basic POST fetch request", async () => {
        const { fetchOptions } = fetchSetup({
            responceBody: null,
            options: {},
            method: "POST",
            requestBody: fetchBody
        });

        await api.post(pathname, fetchBody);
        expect(window.fetch).toHaveBeenCalledWith(FULL_PATH, fetchOptions);
    });

    it("makes a basic PATCH fetch request", async () => {
        const { fetchOptions } = fetchSetup({
            responceBody: null,
            options: {},
            method: "PATCH",
            requestBody: fetchBody
        });

        await api.patch(pathname, fetchBody);
        expect(window.fetch).toHaveBeenCalledWith(FULL_PATH, fetchOptions);
    });

    it("makes a basic DELETE fetch request", async () => {
        const { fetchOptions } = fetchSetup({
            responceBody: null,
            options: {},
            method: "DELETE",
            requestBody: null,
        });

        await api.delete(pathname);
        expect(window.fetch).toHaveBeenCalledWith(FULL_PATH, fetchOptions);
    });

    // it("name", () => {
    //     const { fetchOptions } = fetchSetup();
    // });
});