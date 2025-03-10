const BASE_URL = "http://localhost:4012"

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
    const resp = await fetch(BASE_URL + `/user/${userId}/with-posts`, {
        signal: abortSignal
    });
    const userData = await resp.json();

    return userData;
}

async function getAll(abortSignal) {
    const resp = await fetch(BASE_URL + `/user`, {
        signal: abortSignal,
    });
    const allUsers = await resp.json();

    return allUsers;
}

async function retrieveUsersByName(nameSearch, abortSignal) {
    const resp = await fetch(BASE_URL + `/user/${nameSearch}`, {
        signal: abortSignal,
    });
    const allUsers = await resp.json();

    return allUsers;
}

const userApi = {
    retrieveUserWithPosts,
    retrieveUsersByName,
    register,
    getAll,
    logout,
    login,
}

export default userApi;