import { Router } from 'express'

const commentController = Router();

commentController.post('/comments', async (req, res) => {
    console.log('Works');
    res.end()
})

export default commentController;