import { Request, Response } from "express";
import { createDiaryService, getAllDiariesByUserIdService, getDiaryByIdService } from "../../services/Diary/DiaryService";
import { analyzeSentimentAndSuggestActivities } from "../../utils/gemini";

export const createDiaryController = async (req: Request, res: Response) : Promise<any> => {
    const { userId, text, userProvidedMood } = req.body;

    try {
        const diaryEntry = await createDiaryService(userId, text, userProvidedMood);
        return res.status(201).json(diaryEntry);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getDiaryByIdController = async (req: Request, res: Response) : Promise<any> => {
    const { id } = req.params;

    try {
        const diaryEntry = await getDiaryByIdService(id);

        if (!diaryEntry) {
            return res.status(404).json({ error: "Diary entry not found" });
        }

        return res.status(200).json(diaryEntry);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAllDiariesByUserIdController = async (req: Request, res: Response) : Promise<any> => {
    const { userId } = req.params;

    try {
        const diaryEntries = await getAllDiariesByUserIdService(userId);
        return res.status(200).json(diaryEntries);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
