
import api from '../utils/api.js';

async function handleCreate(payLoad) {
    const resp = await api.post('/comments', payLoad);

    if (resp.error) {
        throw new Error(resp.message);
    };

    return resp.newComment;
}

async function handleUpdate(commentId, payLoad) {
    const resp = await api.patch(`/comments/${commentId}`, { text: payLoad });

    if (resp?.error) {
        throw new Error(resp.message);
    };
}

async function handleDelete(commentId) {
    const resp = await api.delete(`/comments/${commentId}`);

    if (resp.error) {
        throw new Error(resp.message);
    };

    return resp.removedId;
}

const commentServices = {
    handleDelete,
    handleUpdate,
    handleCreate,
}

export default commentServices;