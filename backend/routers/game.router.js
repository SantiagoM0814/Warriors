import { Router } from "express";
import GameController from "../controllers/game.controller.js";

const router = Router();
const name = '/game';

router.route(name)
    .get(GameController.show)
    .post(GameController.register);

router.route(`${name}/:id`)
    .get(GameController.findById)
    .put(GameController.update)
    .delete(GameController.delete);

router.route(`${name}/validate-token`)
    .post(GameController.validateToken);

export default router;