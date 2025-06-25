import { Router } from "express";
import WarriorPowerController from "../controllers/warriorPower.controller.js";

const router = Router();
const name = '/warriorPower';

router.route(name)
    .get(WarriorPowerController.show)
    .post(WarriorPowerController.register);

router.route(`${name}/:id`)
    .get(WarriorPowerController.findById)
    .put(WarriorPowerController.update)
    .delete(WarriorPowerController.delete);

export default router;