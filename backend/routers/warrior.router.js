import { Router } from "express";
import WarriorController from "../controllers/warrior.controller.js";
import { upload } from '../controllers/uploadFile.controller.js';

const router = Router();
const name = '/warrior';

router.route(name)
    .get(WarriorController.show)
    .post(upload.single('photo'), WarriorController.register);

router.route(`${name}/:id`)
    .get(WarriorController.findById)
    .put(upload.single('photo'), WarriorController.update)
    .delete(WarriorController.delete);

export default router;