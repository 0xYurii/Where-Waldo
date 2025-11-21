import { Router } from "express";
import { getPhotos } from "../controllers/get.controller";

const route = Router();

route.get("/photos", getPhotos);

export default route;
