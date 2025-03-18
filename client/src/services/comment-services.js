import defaultAvatar from '/images/default-profile-avatar.png'

import api from '../utils/api.js';

async function handleCreate(payLoad) {
    const resp = await api.post('/comments', payLoad);
    const newComment = await resp.json();

    newComment.owner.imageUrl = newComment.owner.imageUrl ? newComment.owner.imageUrl : defaultAvatar;

    return newComment;
}

async function handleUpdate(commentId, payLoad) {
    await api.patch(`/comments/${commentId}`, payLoad);
}

async function handleDelete(commentId) {
    const resp = await api.delete(`/comments/${commentId}`);
    const removedId = await resp.json();

    return removedId;
}

const commentServices = {
    handleDelete,
    handleUpdate,
    handleCreate,
}

export default commentServices;