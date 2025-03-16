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

async function remove(commentId) {
    const removedComment = await Comment.findByIdAndDelete(commentId);

    return removedComment.onPost;
}

const commentRepositories = {
    create,
    remove,
}

export default commentRepositories;