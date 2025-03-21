import { Router } from "express";

import postRepositories from "../repositories/post-repositries.js";
import userRepositories from "../repositories/user-repositories.js";
import commentRepositories from "../repositories/comment-repositories.js";

const postController = Router();

postController.get('/posts/search', async (req, res) => {
    const { content } = req.query;

    try {
        const filteredPosts = await postRepositories.getAllWithMatchingText(content);

        res.json(filteredPosts);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

postController.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const postData = await postRepositories.getSpecific(postId);

        res.json(postData);
        res.end();
    } catch (error) {
        console.error(error)
    }
})

postController.patch('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    const payload = req.body;

    try {
        await postRepositories.update(postId, payload);

        res.end();
    } catch (error) {
        console.error(error);
    }
})

postController.get('/posts/:postId/with-comments', async (req, res) => {
    const postId = req.params.postId;

    try {
        const postData = await postRepositories.getSpecificWithComments(postId);

        res.json(postData);
        res.end();
    } catch (error) {
        console.error(error)
    }
})

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

postController.delete('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const ownerId = await postRepositories.remove(postId);

        Promise.all([
            await userRepositories.removePost(ownerId, postId),
            await commentRepositories.removeAllSharingPost(postId),
        ])

        res.json(postId);
        res.end();
    } catch (error) {
        console.error(error);
    }

})

postController.post('/posts/:postId/like/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        await postRepositories.addLike(postId, userId);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

postController.delete('/posts/:postId/like/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        await postRepositories.removeLike(postId, userId);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

export default postController;