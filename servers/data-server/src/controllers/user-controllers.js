import { Router } from "express";
import userServices from "../services/user-services.js";

const userController = Router();

userController.post('/register', async (req, res) => {
    
    await userServices.register(req.body);
})

export default userController;