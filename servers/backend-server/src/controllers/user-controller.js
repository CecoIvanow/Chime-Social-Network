import { Router } from "express";
import 'dotenv/config';

import userRepositories from "../repositories/user-repositories.js";

const COOKIE_AUTH_NAME = process.env.COOKIE_AUTH_NAME || "accessToken";

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, userId] = await userRepositories.register(bodyData);

        res.cookie(COOKIE_AUTH_NAME, token, { httpOnly: false });
        res.json(userId);
    } catch (error) {
        console.error(error);
    }
})

userController.post('/login', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, userId] = await userRepositories.login(bodyData);
        res.cookie(COOKIE_AUTH_NAME, token, { httpOnly: false });
        res.json(userId);
    } catch (error) {
        console.error(error);
    }
})

userController.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_AUTH_NAME);
    res.end();
})

userController.get('/users/:userId/with-posts', async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const userData = await userRepositories.getUserAndPopulatePosts(userId);
        
        res.json(userData);
        res.end()
    } catch (error) {
        console.error(error);
    }

})

userController.put('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    const bodyData = req.body;

    try {
        await userRepositories.updateUserData(userId, bodyData);

        res.end()
    } catch (error) {
        console.error(error)
    }
})

userController.get('/users/:userId/full-profile', async (req, res) => {
    const userId = req.params.userId;

    try {
        const data = await userRepositories.getFullProfileWithFriendsPosts(userId);

        res.json(data)
        res.end();
    } catch (error) {
        console.error(error);
    }
})

userController.patch('/users/:userId/friends', async (req, res) => {
    const userId = req.params.userId;
    const { newFriendId } = req.body;

    try {
        Promise.all([
            await userRepositories.addFriend(userId, newFriendId),
            await userRepositories.addFriend(newFriendId, userId),
        ])

        res.end();
    } catch (error) {
        console.error(error);
    }

    res.end();
})

userController.delete('/users/:userId/friends/:friendId', async (req, res) => {
    const {userId, friendId} = req.params;

    try {
        Promise.all([
            await userRepositories.removeFriend(userId, friendId),
            await userRepositories.removeFriend(friendId, userId),
        ])

        res.end();
    } catch (error) {
        console.error(error);
    }

    res.end();
})

userController.get('/users/:userId/fields', async (req, res) => {
    const userId = req.params.userId
    const fields = Object.keys(req.query)
        .at(0)
        .split(',')

    try {
        const userData = await userRepositories.getUserFields(userId, fields);

        res.json(userData);
        res.end();
    } catch (error) {
        console.error(error);
    }
})

userController.patch('/users/:userId/credentials', async (req, res) => {
    const userId = req.params.userId;
    const data = req.body;

    try {
        await userRepositories.changeAccountCredentials(userId, data);

        res.end();
    } catch (error) {
        console.error(error);
    }
})

userController.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userData = await userRepositories.getUserData(userId);

        res.json(userData);
        res.end()
    } catch (error) {
        console.error(error)
    }
})

userController.get('/users', async (req, res) => {
    try {
        const data = await userRepositories.getAll();

        res.json(data);
        res.end()
    } catch (error) {
        console.error(error);
    }
})

export default userController;