const BASE_URL = "http://localhost:4012"

async function register(data) {

    await fetch(BASE_URL + '/register', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });
}

const userClientApi = {
    register,
}

export default userClientApi;