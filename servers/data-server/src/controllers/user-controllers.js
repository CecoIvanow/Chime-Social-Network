import { Router } from "express";

import bcrypt from 'bcrypt';
import User from "../models/User.js";

const userController = Router();

userController.post('/register', async (req, res) => {
    const { email, password, rePass, ...profileData } = req.body;

    const userData = {};
    userData.email = email;
    userData.password = password;
    userData.profileData = profileData;
    
    if (password !== rePass) {
        return;
    }
    
    userData.password = await bcrypt.hash(password, 13);

    await User.create(userData);
})

export default userController;