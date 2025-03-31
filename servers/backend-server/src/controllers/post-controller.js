import { Router } from "express";

import postRepositories from "../repositories/post-repositries.js";
import userRepositories from "../repositories/user-repositories.js";
import commentRepositories from "../repositories/comment-repositories.js";

const postController = Router();

postController.get('/posts', async (req, res) => {
    try {
        const allPosts = await postRepositories.getAll();

        res.json({ allPosts });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message })
    }
    res.end();
})

// postController.get('/posts/:postId', async (req, res) => {
//     const postId = req.params.postId;

//     try {
//         const postData = await postRepositories.getSpecific(postId);

//         res.json(postData);
//         res.end();
//     } catch (error) {
//         console.error(error)
//     }
// })

postController.patch('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
    const payload = req.body;

    try {
        const postText = await postRepositories.update(postId, payload);

        res.json({ postText });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

postController.get('/posts/:postId/with-comments', async (req, res) => {
    const postId = req.params.postId;

    try {
        const postData = await postRepositories.getSpecificWithComments(postId);

        res.json({ postData });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

postController.post('/posts', async (req, res) => {
    const postData = req.body;
    const ownerId = req.body.owner;

    try {
        const newPost = await postRepositories.create(postData);

        if (!newPost?._id) {
            return res.end();
        }

        await userRepositories.attachPostToUser(ownerId, newPost._id);

        res.json({ newPost });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message })
    }
    res.end();
})

postController.delete('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;

    try {
        const ownerId = await postRepositories.remove(postId);

        Promise.all([
            await userRepositories.removePost(ownerId, postId),
            await commentRepositories.removeAllSharingPost(postId),
        ])

        res.json({ removedPostId: postId });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

postController.post('/posts/:postId/like/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        await postRepositories.addLike(postId, userId);
    } catch (error) {
        console.error(error);
        res.json({ error: error.message })
    }
    res.end();
})

postController.delete('/posts/:postId/like/:userId', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.params.userId;

    try {
        await postRepositories.removeLike(postId, userId);
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

export default postController;