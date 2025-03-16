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

async function handleGetPostDataWithComments(postId, abortSignal) {
    const resp = await api.get(`/posts/${postId}/with-comments`, abortSignal);
    const postData = await resp.json();

    postData.owner.imageUrl = postData.owner.imageUrl ? postData.owner.imageUrl : defaultAvatar;
    postData.comments
        .reverse()
        .map(comment => comment.owner.imageUrl = comment.owner.imageUrl ? comment.owner.imageUrl : defaultAvatar);

    return postData;
}

const postServices = {
    handleGetAllByContentWithOwners,
    handleGetPostDataWithComments,
    handlePostCreate,
    handleDelete,
    handleUnlike,
    handleLike,
}

export default postServices