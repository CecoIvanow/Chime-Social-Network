const BASE_URL = import.meta.env.VITE_API_REST_SERVER_URI || 'http://localhost:4012';

async function register(data) {

    const resp = await fetch(BASE_URL + '/register', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    const userId = await resp.json();

    return userId;
}

async function login(data) {
    const resp = await fetch(BASE_URL + '/login', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });
    const userId = resp.json();

    return userId;
}

async function logout() {
    await fetch(BASE_URL + '/logout', {
        credentials: 'include',
    });
}

async function retrieveUserWithPosts(userId, abortSignal) {
    const resp = await fetch(BASE_URL + `/users/${userId}/with-posts`, {
        signal: abortSignal
    });
    const userData = await resp.json();

    return userData;
}

async function getAll(abortSignal) {
    const resp = await fetch(BASE_URL + `/users`, {
        signal: abortSignal,
    });
    const allUsers = await resp.json();

    return allUsers;
}

async function retrieveUsersByName(nameSearch, abortSignal) {
    const resp = await fetch(BASE_URL + `/users/search?name=${nameSearch}`, {
        signal: abortSignal,
    });
    const allUsers = await resp.json();

    return allUsers;
}

async function retrieveUserFields(userId, fields, abortSignal) {
    const resp = await fetch(BASE_URL + `/users/${userId}/fields?${fields}`, {
        signal: abortSignal,
    });
    const userData = await resp.json();

    return userData;
}

const userApi = {
    retrieveUserWithPosts,
    retrieveUsersByName,
    retrieveUserFields,
    register,
    getAll,
    logout,
    login,
}

export default userApi;