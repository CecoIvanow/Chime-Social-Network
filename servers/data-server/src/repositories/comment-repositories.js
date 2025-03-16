import Comment from "../models/Comment.js";

async function create(data) {
    const newComment = await Comment.create(data);

    return newComment;
}

const commentRepositories = {
    create
}

export default commentRepositories;