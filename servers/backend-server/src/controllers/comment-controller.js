import { Router } from 'express'

import commentRepositories from '../repositories/comment-repositories.js';
import postRepositories from '../repositories/post-repositries.js';

const commentController = Router();

commentController.post('/comments', async (req, res) => {
    const commentData = req.body;

    try {
        const newComment = await commentRepositories.create(commentData);

        if (!newComment?._id) {
            return res.end();
        }

        await postRepositories.attachCommentToPost(commentData.onPost, newComment._id);

        res.json({ newComment });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

commentController.delete('/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const parentPostId = await commentRepositories.removeSpecific(commentId);

        if (!parentPostId) {
            return res.end();
        }

        await postRepositories.removeComment(parentPostId, commentId);

        res.json({ removedId: commentId });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

commentController.patch('/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId;
    const payload = req.body;

    try {
        await commentRepositories.update(commentId, payload);

    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

export default commentController;