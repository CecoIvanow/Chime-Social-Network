import { Router } from 'express'
import commentRepositories from '../repositories/comment-repositories.js';
import postRepositories from '../repositories/post-repositries.js';

const commentController = Router();

commentController.post('/comments', async (req, res) => {
    const commentData = req.body;

    try {
        const newComment = await commentRepositories.create(commentData);

        await postRepositories.attachCommentToPost(commentData.onPost, newComment._id);

        res.json(newComment);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

commentController.delete('/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId;

    try {
        const postId = await commentRepositories.removeSpecific(commentId);

        await postRepositories.removeComment(postId, commentId);

        res.json(commentId);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

commentController.patch('/comments/:commentId', async (req, res) => {
    const commentId = req.params.commentId;
    const payload = req.body;

    try {
        await commentRepositories.update(commentId, payload);

        res.end();
    } catch (error) {
        console.error(error);
    }
})

export default commentController;