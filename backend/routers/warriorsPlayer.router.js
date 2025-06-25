import { Router } from "express";
import WarriorsPlayerController from "../controllers/warriorsPlayer.controller.js";

const router = Router();
const name = '/warriorsPlayer';

router.route(name)
    .get(WarriorsPlayerController.show)
    .post(WarriorsPlayerController.register);

router.route(`${name}/:id`)
    .get(WarriorsPlayerController.findById)
    .put(WarriorsPlayerController.update)
    .delete(WarriorsPlayerController.delete);

export default router;