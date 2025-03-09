const BASE_URL = "http://localhost:4012";

async function createPost(postData) {
    const resp = await fetch(BASE_URL + '/posts', {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(postData),
        credentials: 'include',
    });

    console.log(resp);
}

const postApi = {
    createPost
}

export default postApi;