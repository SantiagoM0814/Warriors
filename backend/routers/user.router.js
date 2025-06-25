import { Router } from "express";
import UserController from "../controllers/user.controller.js";

const router = Router();
const name = '/user';
const nameLogin = '/login';

router.route(name)
    .get(UserController.show)
    .post(UserController.register);

router.route(`${name}/:id`)
    .get(UserController.findById)
    .put(UserController.update)
    .delete(UserController.delete);

router.route(nameLogin)
    .post(UserController.login);

export default router;