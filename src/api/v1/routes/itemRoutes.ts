import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { itemSchemas } from "../validations/itemValidation";
import * as itemController from "../controllers/itemController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { getUserDetails } from "../controllers/userController";

const router: Router = express.Router();

// "/api/v1/items" prefixes all below routes
router.get("/", authenticate, itemController.getAllItems);
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"] }),
    validateRequest(itemSchemas.create),
    itemController.createItem
);
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager"], allowSameUser: true }),
    validateRequest(itemSchemas.update),
    itemController.updateItem
);
router.delete("/:id", authenticate, isAuthorized({ hasRole: ["admin", "manager"] }), itemController.deleteItem);
router.get("/:id", authenticate, itemController.getItemsByIdController);

export default router;
