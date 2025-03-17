import { Router } from "express";

import userController from "./controllers/user-controller.js";
import postController from "./controllers/post-controller.js";
import commentController from "./controllers/comment-controller.js";

const routes = Router();

routes.use(userController);
routes.use(postController);
routes.use(commentController);

export default routes;