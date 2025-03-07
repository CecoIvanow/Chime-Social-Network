import { Router } from "express";

const routes = Router();

routes.get('/', (req, res) => {
    res.send('Works successfully!');
})

export default routes;