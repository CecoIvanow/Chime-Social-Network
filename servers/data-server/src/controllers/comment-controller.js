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
        console.error(error.message);
    }
})

export default commentController;