import { Router } from "express";

import userController from "./controllers/user-controllers.js";
import postController from "./controllers/post-controller.js";

const routes = Router();

routes.use(userController);
routes.use(postController);

export default routes;