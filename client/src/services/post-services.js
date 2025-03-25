import defaultAvatar from '/images/default-profile-avatar.png'

import api from '../utils/api.js';

async function handlePostCreate(postData) {
    const newPost = await api.post('/posts', postData)

    return newPost;
}

async function handleGetAllByContentWithOwners(searchParam, abortSignal) {
    const matchedPosts = await api.get(`/posts/search?content=${searchParam}`, { signal: abortSignal });

    matchedPosts
        .reverse()
        .map(post => post.owner.imageUrl = post.owner.imageUrl ? post.owner.imageUrl : defaultAvatar);

    return matchedPosts;
}

async function handleDelete(postId) {
    const removedPostId = await api.delete(`/posts/${postId}`);

    return removedPostId;
}

async function handleLike(userId, postId) {
    await api.post(`/posts/${postId}/like/${userId}`);
}

async function handleUnlike(userId, postId) {
    await api.delete(`/posts/${postId}/like/${userId}`);
}

async function handleGetPostDataWithComments(postId, abortSignal) {
    const postData = await api.get(`/posts/${postId}/with-comments`, { signal: abortSignal });

    postData.owner.imageUrl = postData.owner.imageUrl ? postData.owner.imageUrl : defaultAvatar;
    postData.comments
        .reverse()
        .map(comment => comment.owner.imageUrl = comment.owner.imageUrl ? comment.owner.imageUrl : defaultAvatar);

    return postData;
}

async function handleGetPostData(postId, abortSignal) {
    const postData = await api.get(`/posts/${postId}/with-comments`, { signal: abortSignal });

    postData.owner.imageUrl = postData.owner.imageUrl ? postData.owner.imageUrl : defaultAvatar;

    return postData;
}

async function handlePostUpdate(postId, newText) {    
    await api.patch(`/posts/${postId}`, {text: newText});
}

const postServices = {
    handleGetAllByContentWithOwners,
    handleGetPostDataWithComments,
    handleGetPostData,
    handlePostCreate,
    handlePostUpdate,
    handleDelete,
    handleUnlike,
    handleLike,
}

export default postServices