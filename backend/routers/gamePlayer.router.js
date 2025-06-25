import { Router } from "express";
import GamePlayerController from "../controllers/gamePlayer.controller.js";

const router = Router();
const name = '/gamePlayer';

router.route(name)
    .get(GamePlayerController.show)
    .post(GamePlayerController.register);

router.route(`${name}/:id`)
    .get(GamePlayerController.findById)
    .put(GamePlayerController.update)
    .delete(GamePlayerController.delete);

export default router;