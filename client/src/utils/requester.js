const BASE_URL = 'http://localhost:4012';

async function fetcher(path, method, body, abortSignal) {
    const options = {
        method,
        headers: {
            'Content-type': 'application/json',
        },
        credentials: 'include'
    }


    if (abortSignal) {
        options.signal = abortSignal;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }

    return await fetch(BASE_URL + path, options);
}

const request = {
    get: async (path, abortsignal) => await fetcher(path, 'GET', undefined, abortsignal),
    post: async (path, body) => await fetcher(path, 'POST', body),
}

export default request