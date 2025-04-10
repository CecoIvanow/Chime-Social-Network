import { Router } from 'express'

import commentRepositories from '../repositories/comment-repositories.js';
import postRepositories from '../repositories/post-repositries.js';

const commentController = Router();

commentController.post('/comments', async (req, res) => {
    const commentData = req.body;

    try {
        const data = await commentRepositories.create(commentData);

        if (!data?._id) {
            return res.end();
        }

        await postRepositories.attachCommentToPost(commentData.onPost, data._id);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

commentController.delete('/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const data = await commentRepositories.removeSpecific(commentId);

        if (!data) {
            return res.end();
        }

        await postRepositories.removeComment(data, commentId);

        res.json({ data: commentId });
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
        const data = await commentRepositories.update(commentId, payload);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

export default commentController;