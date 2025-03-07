import { Router } from "express";
import userServices from "../server-services/server-user-services.js";

const userController = Router();

userController.post('/register', async (req, res) => {
    const bodyData = req.body;

    try {
        await userServices.register(bodyData);
    } catch (error) {
        console.error(error.message)
    }
})

export default userController;