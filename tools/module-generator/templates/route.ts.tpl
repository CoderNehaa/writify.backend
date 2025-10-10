// {{module}}.route.ts for {{module}} module
import { Router } from "express";
import { BaseValidator } from "../base/base.validator";
import { {{module}}Controller, authMiddleware } from "../container";

const {{module}}Router = Router();
const { validateEndpoint, paramsIdValidator } = BaseValidator;

{{module}}Router.use(authMiddleware.authentic);

{{module}}Router.get(
  "/all",
  validateEndpoint(),
  {{module}}Controller.getAll
);
{{module}}Router.get(
  "/data/:id",
  validateEndpoint(paramsIdValidator),
  {{module}}Controller.getById
);
{{module}}Router.put(
  "/:id",
  validateEndpoint(), //Implement validator with params and body
  {{module}}Controller.updateById
);
{{module}}Router.delete(
  "/:id",
  validateEndpoint(paramsIdValidator),
  {{module}}Controller.deleteById
);

export default {{module}}Router;
