import { Router } from "express";
import BreedController from "../controllers/breed.controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
const name = '/breed';

router.route(name)
    .get(BreedController.show)
    .post(BreedController.register);

router.route(`${name}/:id`)
    .get(BreedController.findById)
    .put(BreedController.update)
    .delete(BreedController.delete);

export default router;