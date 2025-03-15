import { Router } from "express";

import postRepositories from "../repositories/post-repositries.js";
import userRepositories from "../repositories/user-repositories.js";

const postController = Router();

postController.post('/posts', async (req, res) => {
    const postData = req.body;
    const ownerId = req.body.owner;

    try {
        const newPost = await postRepositories.create(postData);

        await userRepositories.attachPostToUser(ownerId, newPost._id);

        res.json(newPost);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

postController.get('/posts/search', async (req, res) => {
    const { content } = req.query;

    try {
        const filteredPosts = await postRepositories.getAllWithMatchingText(content);

        res.json(filteredPosts);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
})

postController.delete('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const ownerId = await postRepositories.remove(postId);

        await userRepositories.removePost(ownerId, postId);

        res.send(postId);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
    
})

postController.post('/posts/:postId/like/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        await postRepositories.addLike(postId, userId);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
})

postController.delete('/posts/:postId/like/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        await postRepositories.removeLike(postId, userId);
        res.end();
    } catch (error) {
        console.error(error.message);
    }
})

export default postController;