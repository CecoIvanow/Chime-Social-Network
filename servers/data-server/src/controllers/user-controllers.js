import { Router } from "express";
import 'dotenv/config';

import userServerApi from "../server-api/user-server-api.js";

const COOKIE_NAME = process.env.COOKIE_AUTH_NAME;

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        const token = await userServerApi.register(bodyData);

        res.cookie(COOKIE_NAME, token, { httpOnly: false });
        res.end();
    } catch (error) {
        console.error(error.message);
    }

})

export default userController;