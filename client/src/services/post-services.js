import defaultAvatar from '/images/default-profile-avatar.png'

import api from '../utils/api.js';

async function handlePostCreate(postData) {
    const resp = await api.post('/posts', postData)
    const newPost = await resp.json();

    return newPost;
}

async function handleGetAllByContentWithOwners(searchParam, abortSignal) {
    const resp = await api.get(`/posts/search?content=${searchParam}`, abortSignal);
    const matchedPosts = await resp.json();

    matchedPosts
        .reverse()
        .map(post => post.owner.imageUrl = post.owner.imageUrl ? post.owner.imageUrl : defaultAvatar);

    return matchedPosts;
}

async function handleDelete(postId) {
    const resp = await api.delete(`/posts/${postId}`);
    const removedPostId = await resp.json();

    return removedPostId;
}

async function handleLike(userId, postId) {
    await api.post(`/posts/${postId}/like/${userId}`);
}

async function handleUnlike(userId, postId) {
    await api.delete(`/posts/${postId}/like/${userId}`);
}

const postServices = {
    handleGetAllByContentWithOwners,
    handlePostCreate,
    handleDelete,
    handleUnlike,
    handleLike
}

export default postServices