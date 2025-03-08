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

const userApi = {
    register,
}

export default userApi;