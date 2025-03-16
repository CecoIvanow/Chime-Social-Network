import api from '../utils/api.js';

async function create(payLoad) {
    const resp = await api.post('/comments', payLoad);
    const newComment = await resp.json();

    return newComment;
}

const commentServices = {
    create
}

export default commentServices;