
import api from '../utils/api.js';

async function handleCreate(payLoad) {
    const resp = await api.post('/comments', payLoad);

    if (resp?.error) {
        throw new Error(resp.error);
    } else if (resp?.data) {
        return resp.data
    }

    return;
}

async function handleUpdate(commentId, payLoad) {
    const updatedText = payLoad.trim();

    if (!updatedText) {
        return;
    }

    const resp = await api.patch(`/comments/${commentId}`, { text: updatedText });

    if (resp?.error) {
        throw new Error(resp.error);
    };

    return resp.commentText;
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