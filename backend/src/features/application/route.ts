import { Router } from "express";
import * as applicationController from "./controller.js";
import { asyncHandler } from "../../middleware/asyncHandler.js";
import { validate } from "../../middleware/validate.js";
import { applicationSchema, applicationUpdateSchema, applicationQuerySchema } from "./schema.js";

const router = Router();

router.get(
  "/",
  validate(applicationQuerySchema, "query"),
  asyncHandler(applicationController.list)
);

router.get("/:id", asyncHandler(applicationController.getById));

router.post(
  "/",
  validate(applicationSchema, "body"),
  asyncHandler(applicationController.create)
);

router.patch(
  "/:id",
  validate(applicationUpdateSchema, "body"),
  asyncHandler(applicationController.update)
);

router.delete("/:id", asyncHandler(applicationController.remove));

export default router;
