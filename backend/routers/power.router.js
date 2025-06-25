import { Router } from 'express';
import PowerController from '../controllers/power.controller.js';

const router = Router();
const name = '/power';

router.route(name)
    .post(PowerController.register)
    .get(PowerController.show);

router.route(`${name}/:id`)
    .get(PowerController.findById)
    .put(PowerController.update)
    .delete(PowerController.delete);

export default router;