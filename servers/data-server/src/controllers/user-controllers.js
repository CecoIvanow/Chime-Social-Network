import { Router } from "express";
import userServices from "../services/user-services.js";

const userController = Router();

userController.post('/register', async (req, res) => {
    try {
        await userServices.register(req.body);
    } catch (error) {
        console.error(error.message)
    }
})

export default userController;