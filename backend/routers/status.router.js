import { Router } from 'express';
import StatusController from '../controllers/status.controller.js';

const router = Router();
const name = '/status';

router.route(name)
    .get(StatusController.show)
    .post(StatusController.register);

router.route(`${name}/:id`)
    .get(StatusController.findById)
    .put(StatusController.update)
    .delete(StatusController.delete);

export default router;