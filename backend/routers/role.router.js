import { Router } from 'express';
import RoleController from '../controllers/role.controller.js';

const router = Router();
const name = '/role';

router.route(name)
    .get(RoleController.show)
    .post(RoleController.register);

router.route(`${name}/:id`)
    .get(RoleController.findById)
    .put(RoleController.update)
    .delete(RoleController.delete);

export default router;