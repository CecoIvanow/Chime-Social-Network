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

async function addLike(userId, postId) {
    await request.post(`/posts/${postId}/like`, { userId });
}

async function removeLike(userId, postId) {
    await request.delete(`/posts/${postId}/like/${userId}`);
}

const postApi = {
    retrieveByContent,
    removeLike,
    addLike,
    create,
    remove,
}

export default postApi;