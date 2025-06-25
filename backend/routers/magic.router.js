import { Router } from 'express';
import MagicController from '../controllers/magic.controller.js';

const router = Router();
const name = '/magic';

router.route(name)
    .get(MagicController.show)
    .post(MagicController.register);

router.route(`${name}/:id`)
    .get(MagicController.findById)
    .put(MagicController.update)
    .delete(MagicController.delete);

export default router;