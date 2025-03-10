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

    const newPost = await resp.json();

    return newPost;
}

async function getAll() {

    const resp = await fetch(BASE_URL + '/posts', {
        credentials: 'include',
    });

    const allPosts = await resp.json();

    return allPosts;
}

const postApi = {
    createPost,
    getAll,
}

export default postApi;