import request from "../utils/requester.js";

async function create(postData) {
    const resp = await request.post('/posts', postData)

    const newPost = await resp.json();

    return newPost;
}

async function retrieveByContent(contentSearch, abortSignal) {
    const resp = await request.get(`/posts/search?content=${contentSearch}`, abortSignal);

    const foundPosts = await resp.json();
    
    return foundPosts
}

async function remove(postId) {
    const resp = await request.delete(`/posts/${postId}`);

    const removedPostId = await resp.json();

    return removedPostId;
}

const postApi = {
    retrieveByContent,
    create,
    remove,
}

export default postApi;