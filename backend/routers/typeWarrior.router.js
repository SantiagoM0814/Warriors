import { Router } from 'express';
import TypeWarriorController from '../controllers/typeWarrior.controller.js';

const router = Router();
const name = '/typeWarrior';

router.route(name)
    .get(TypeWarriorController.show)
    .post(TypeWarriorController.register);

router.route(`${name}/:id`)
    .get(TypeWarriorController.findById)
    .put(TypeWarriorController.update)
    .delete(TypeWarriorController.delete);

export default router;