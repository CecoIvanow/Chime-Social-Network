import { Router } from "express";

const postController = Router();

postController.post('/posts', (req, res) => {
    console.log('It works');
})

export default postController;