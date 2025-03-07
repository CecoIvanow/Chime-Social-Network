import { Router } from "express";
import userServerApi from "../server-api/user-api.js";

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        await userServerApi.register(bodyData);
    } catch (error) {
        console.error(error.message)
    }
})

export default userController;