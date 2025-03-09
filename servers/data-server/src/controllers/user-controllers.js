import { Router } from "express";
import 'dotenv/config';

import userRepositories from "../repositories/user-repositories.js";

const COOKIE_AUTH_NAME = process.env.COOKIE_AUTH_NAME;

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, userId] = await userRepositories.register(bodyData);

        res.cookie(COOKIE_AUTH_NAME, token, { httpOnly: false });
        res.json(userId);
    } catch (error) {
        console.error(error.message);
    }
})

userController.post('/login', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, userId] = await userRepositories.login(bodyData);
        res.cookie(COOKIE_AUTH_NAME, token, { httpOnly: false });
        res.json(userId);
    } catch (error) {
        console.error(error.message);
    }
})

userController.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_AUTH_NAME);
    res.end();
})

userController.get('/user/:userId',async (req, res) => {
    const userId = req.params.userId;

    try {
        const userData = await userRepositories.fetchOne(userId);

        res.json(userData);
        res.end()
    } catch (error) {
        console.error(error);
    }
    
})

export default userController;