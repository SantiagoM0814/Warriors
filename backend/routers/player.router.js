import { Router } from 'express';
import PlayerController from '../controllers/player.controller.js';

const router = Router();
const name = '/player';

router.route(name)
    .get(PlayerController.show)
    .post(PlayerController.register);

router.route(`${name}/:id`)
    .get(PlayerController.findById)
    .put(PlayerController.update)
    .delete(PlayerController.delete);

export default router;