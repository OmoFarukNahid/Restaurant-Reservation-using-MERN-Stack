import express from "express";
import { 
  createRecommendation,
  getRecommendations,
  updateRecommendation,
  deleteRecommendation
} from "../controller/recommendationController.js";
import { isLoggedIn } from "../middleware/isLoggedIn.js";

const router = express.Router();

router.post("/", isLoggedIn, createRecommendation);
router.get("/", isLoggedIn, getRecommendations);
router.put("/:id", isLoggedIn, updateRecommendation);
router.delete("/:id", isLoggedIn, deleteRecommendation);

export default router;