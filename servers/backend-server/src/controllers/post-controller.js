import { Router } from "express";

import postRepositories from "../repositories/post-repositries.js";
import userRepositories from "../repositories/user-repositories.js";
import commentRepositories from "../repositories/comment-repositories.js";

const postController = Router();

postController.get('/posts', async (req, res) => {
    try {
        const data = await postRepositories.getAll();

        res.json({ data });
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
        const data = await postRepositories.update(postId, payload);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

postController.get('/posts/:postId/with-comments', async (req, res) => {
    const postId = req.params.postId;

    try {
        const data = await postRepositories.getSpecificWithComments(postId);

        res.json({ data });
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
        const data = await postRepositories.create(postData);

        if (!data?._id) {
            return res.end();
        }

        await userRepositories.attachPostToUser(ownerId, data._id);

        res.json({ data });
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

        res.json({ data: postId });
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