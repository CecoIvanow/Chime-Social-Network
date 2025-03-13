import request from "../utils/requester.js";

async function register(data) {

    const resp = await request.post('/register', data);

    const userId = await resp.json();

    return userId;
}

async function login(data) {
    const resp = await request.post('/login', data);

    const userId = await resp.json();

    return userId;
}

async function logout() {
    await request.get('/logout');
}

async function retrieveUserWithPosts(userId, abortSignal) {
    const resp = await request.get(`/users/${userId}/with-posts`, abortSignal);

    const userData = await resp.json();

    return userData;
}

async function retrieveUsersByName(nameSearch, abortSignal) {
    const resp = await request.get(`/users/search?name=${nameSearch}`, abortSignal);

    const foundUsers = await resp.json();

    return foundUsers;
}

async function retrieveUserDataByFields(userId, fields, abortSignal) {
    const resp = await request.get(`/users/${userId}/fields?${fields}`, abortSignal);

    const userData = await resp.json();

    return userData;
}

const userApi = {
    retrieveUserWithPosts,
    retrieveUsersByName,
    retrieveUserDataByFields,
    register,
    logout,
    login,
}

export default userApi;