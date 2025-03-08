import { Router } from "express";
import 'dotenv/config';

import userServerApi from "../repositories/user-repositories.js";

const COOKIE_NAME = process.env.COOKIE_AUTH_NAME;

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        const [token, userId] = await userServerApi.register(bodyData);

        res.cookie(COOKIE_NAME, token, { httpOnly: false });
        res.json(userId);
    } catch (error) {
        console.error(error.message);
    }
})

export default userController;