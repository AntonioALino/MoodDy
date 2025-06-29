import { Router } from "express";  

import  {
    createDiaryController,
    getDiaryByIdController,
    getAllDiariesByUserIdController
} from '../../controllers/Diary/DiaryControllers';

const router = Router();

router.post("/create/diary", createDiaryController);

router.get("/:id", getDiaryByIdController);

router.get("/user/:userId", getAllDiariesByUserIdController);

export default router;