import { Router } from "express";
import userController from "./controllers/user-controllers.js";

const routes = Router();

routes.use(userController);

export default routes;