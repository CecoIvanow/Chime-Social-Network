import Comment from "../models/Comment.js";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function create(data) {
    const newComment = await Comment.create(data);

    await newComment.populate({
        path: 'owner',
        select: COMMONLY_NEEDED_PARAMS
    });

    return newComment;
}

const commentRepositories = {
    create
}

export default commentRepositories;