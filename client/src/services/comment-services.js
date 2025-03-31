
import api from '../utils/api.js';

async function handleCreate(payLoad) {
    const resp = await api.post('/comments', payLoad);

    if (resp?.error) {
        alert(resp.error);
        throw new Error(resp.error);
    } else if (resp?.newComment) {
        return resp.newComment
    } else {
        return
    }
}

async function handleUpdate(commentId, payLoad) {
    const resp = await api.patch(`/comments/${commentId}`, { text: payLoad });

    if (resp?.error) {
        throw new Error(resp.error);
    };
}

async function handleDelete(commentId) {
    const resp = await api.delete(`/comments/${commentId}`);

    if (resp.error) {
        throw new Error(resp.error);
    };

    return resp.removedId;
}

const commentServices = {
    handleDelete,
    handleUpdate,
    handleCreate,
}

export default commentServices;