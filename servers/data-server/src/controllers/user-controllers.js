import { Router } from "express";
import 'dotenv/config';

import userServerApi from "../repositories/user-repositories.js";

const COOKIE_AUTH_NAME = process.env.COOKIE_AUTH_NAME;

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, userId] = await userServerApi.register(bodyData);

        res.cookie(COOKIE_AUTH_NAME, token, { httpOnly: false });
        res.json(userId);
    } catch (error) {
        console.error(error.message);
    }
})

userController.get('/logout', (req, res) => {
    console.log('this works?');
    
    res.clearCookie(COOKIE_AUTH_NAME);
    res.end();
})

export default userController;