const BASE_URL = 'http://localhost:4012';

async function fetcher(path, method, body, options = {}) {
    options = {
        ...options,
        method,
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include'
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    const resp = await fetch(BASE_URL + path, options);
    const contentHeaders = resp.headers.get('Content-type');

    if (contentHeaders?.includes('application/json')) {
        return await resp.json();
    } else {
        return;
    }
}

const api = {
    get: async (path, options) => await fetcher(path, 'GET', null, options),
    put: async (path, body, options) => await fetcher(path, 'PUT', body, options),
    post: async (path, body, options) => await fetcher(path, 'POST', body, options),
    patch: async (path, body, options) => await fetcher(path, 'PATCH', body, options),
    delete: async (path, options) => await fetcher(path, 'DELETE', null, options),
}

export default api