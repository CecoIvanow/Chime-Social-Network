import Comment from "../models/Comment.js";
import User from "../models/User.js";
import Post from "../models/Post.js";

import { postedOnDateConverter } from "../utils/date-time-utils.js";
import mongoose from "mongoose";

const COMMONLY_NEEDED_PARAMS = 'firstName lastName imageUrl'

async function create(commentData) {
    // The line below offsets the time with 2+ hours as new Date() is 2 hours behind;
    const creationTime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000);

    const [ownerId, parentPostId] = await Promise.all([
        User.findById(commentData.owner).select('_id').lean(),
        Post.findById(commentData.onPost).select('_id').lean(),
    ])

    if (!ownerId) {
        throw new Error("Could not create: Creator id is invalid or missing");
    } else if (!parentPostId) {
        throw new Error("Could not create: Parent post id is invalid or missing");
    } else if (!commentData.text) {
        return;
    }

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

    if (!removedComment) {
        throw new Error("Could not remove: Comment is invalid or missing!");
    }

    return removedComment.onPost;
}

async function removeAllSharingPost(postId) {
    if (!postId) {
        throw new Error("Parent post id is missing!");
    }

    //Pretty scary stuff over here, deleting so many documents
    await Comment.deleteMany({ onPost: postId });
}

async function update(commentId, payload) {
    const comment = await Comment.findByIdAndUpdate(commentId, payload);

    if (!comment) {
        throw new Error("Could not update: Comment is invalid or missing!");
    }
}

const commentRepositories = {
    removeAllSharingPost,
    removeSpecific,
    update,
    create,
}

export default commentRepositories;