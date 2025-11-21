import { Router } from "express";
import { validateCoordinates } from "../controllers/validate.controller";

const validate = Router();

validate.post("/validate", validateCoordinates);

export default validate;
