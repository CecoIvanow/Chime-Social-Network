
import api from '../utils/api.js';

async function handleCreate(payLoad) {
    const newComment = await api.post('/comments', payLoad);

    return newComment;
}

async function handleUpdate(commentId, payLoad) {
    await api.patch(`/comments/${commentId}`, { text: payLoad });
}

async function handleDelete(commentId) {
    const removedId = await api.delete(`/comments/${commentId}`);

    return removedId;
}

const commentServices = {
    handleDelete,
    handleUpdate,
    handleCreate,
}

export default commentServices;