import defaultAvatar from '/images/default-profile-avatar.png'

import api from '../utils/api.js';

async function create(payLoad) {
    const resp = await api.post('/comments', payLoad);
    const newComment = await resp.json();

    newComment.owner.imageUrl = newComment.owner.imageUrl ? newComment.owner.imageUrl : defaultAvatar;

    return newComment;
}

const commentServices = {
    create
}

export default commentServices;