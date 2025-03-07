const BASE_URL = "http://localhost:4012"

async function registerUser(data) {

    await fetch(BASE_URL + '/register', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    });

}

const clientServices = {
    registerUser,
}

export default clientServices;