import request from "../utils/requester.js";

async function create(postData) {
    const resp = await request.post('/posts', postData)

    const newPost = await resp.json();

    return newPost;
}

async function getAllWithOwners(abortSignal) {
    const resp = await request.get('/posts/with-owners', abortSignal);

    const allPosts = await resp.json();

    return allPosts;
}

async function retrieveByContent(contentSearch, abortSignal) {
    const resp = await request.get(`/posts/search?content=${contentSearch}`, abortSignal);

    const foundPosts = await resp.json();
    
    return foundPosts
}

const postApi = {
    retrieveByContent,
    getAllWithOwners,
    create,
}

export default postApi;