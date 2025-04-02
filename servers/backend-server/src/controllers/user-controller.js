import 'dotenv/config';

import { Router } from "express";

import userRepositories from "../repositories/user-repositories.js";

const COOKIE_AUTH_NAME = process.env.COOKIE_AUTH_NAME || "accessToken";

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, data] = await userRepositories.register(bodyData);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

userController.post('/login', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, data] = await userRepositories.login(bodyData);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

userController.get('/logout', (req, res) => {
    res.end();
})

userController.get('/users/:userId/with-posts', async (req, res) => {
    const userId = req.params.userId;

    try {
        const data = await userRepositories.getUserAndPopulatePosts(userId);

        res.json({ data });
    } catch (error) {
        res.json({ error: error.message });
    }

    res.end()
})

userController.put('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const bodyData = req.body;

    try {
        await userRepositories.updateUserData(userId, bodyData);

    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end()
})

userController.get('/users/:userId/full-profile', async (req, res) => {
    const userId = req.params.userId;

    try {
        const data = await userRepositories.getFullProfileWithFriendsPosts(userId);

        res.json({ data })
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

userController.patch('/users/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        await userRepositories.addFriend(userId, friendId);

    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }

    res.end();
})

userController.delete('/users/:userId/friends/:friendId', async (req, res) => {
    const { userId, friendId } = req.params;

    try {
        await userRepositories.removeFriend(userId, friendId);

    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }

    res.end();
})

userController.get('/users/:userId/fields', async (req, res) => {
    const userId = req.params.userId;
    const fields = Object.keys(req.query).at(0).split(',');

    try {
        const data = await userRepositories.getUserFields(userId, fields);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

userController.patch('/users/:userId/credentials', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        const result = await userRepositories.changeAccountCredentials(userId, data);

        res.json({ data: result });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end();
})

userController.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const data = await userRepositories.getUserData(userId);

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }
    res.end()
})

userController.get('/users', async (req, res) => {
    try {
        const data = await userRepositories.getAll();

        res.json({ data });
    } catch (error) {
        console.error(error);
        res.json({ error: error.message });
    }

    res.end()
})

export default userController;