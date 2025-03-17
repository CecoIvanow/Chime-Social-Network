import Comment from "../models/Comment.js";
import { postedOnDateConverter } from "../utils/date-time-utils.js";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function create(commentData) {
    // The line below offsets the time with 2+ hours as new Date() is 2 hours behind;
    const creationTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);

    commentData.createdAt = creationTime;
    commentData.postedOn = postedOnDateConverter(creationTime);

    const newComment = await Comment.create(commentData);

    await newComment.populate({
        path: 'owner',
        select: COMMONLY_NEEDED_PARAMS
    });

    return newComment;
}

async function removeSpecific(commentId) {
    const removedComment = await Comment.findByIdAndDelete(commentId);

    return removedComment.onPost;
}

async function removeAllSharingPost(postId) {
    //Pretty scary stuff over here, deleting so many documents
    await Comment.deleteMany({ onPost: postId });
}

const commentRepositories = {
    removeAllSharingPost,
    removeSpecific,
    create,
}

export default commentRepositories;