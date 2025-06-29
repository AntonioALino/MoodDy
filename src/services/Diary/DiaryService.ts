import { prisma } from "../../database/Prisma";
import { analyzeSentimentAndSuggestActivities } from "../../utils/gemini";

export const createDiaryService = async(userId: string, text: string, userProvidedMood: string) => {
    try{ 

        const geminiAnalysisResult = await analyzeSentimentAndSuggestActivities(text);
        
        let sentimentScore: number | null = null;
         if (geminiAnalysisResult.aiInferredEmotion === 'positivo' || geminiAnalysisResult.aiInferredEmotion === 'alegria' || geminiAnalysisResult.aiInferredEmotion === 'esperança') {
             sentimentScore = 1;
         } else if (geminiAnalysisResult.aiInferredEmotion === 'negativo' || geminiAnalysisResult.aiInferredEmotion === 'tristeza' || geminiAnalysisResult.aiInferredEmotion === 'raiva' || geminiAnalysisResult.aiInferredEmotion === 'ansiedade' || geminiAnalysisResult.aiInferredEmotion === 'cansaço') {
             sentimentScore = -1;
         } else if (geminiAnalysisResult.aiInferredEmotion === 'neutro') {
             sentimentScore = 0;
         }

    const newDiaryEntry = await prisma.diaryEntry.create({
        data: {
            userId: userId,
            text: text,
            userProvidedMood: userProvidedMood,
            aiInferredEmotion: geminiAnalysisResult.aiInferredEmotion, 
            sentimentScore: sentimentScore, 
            suggestedActivities: geminiAnalysisResult.suggestedActivities, 
        },
        select: {
            id: true,
            userId: true,
            text: true,
            userProvidedMood: true,
            aiInferredEmotion: true,
            sentimentScore: true,
            suggestedActivities: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return newDiaryEntry;
} 
    catch (error) {
        console.error("Erro ao analisar o sentimento com Gemini:", error);
        throw new Error("Erro ao analisar o sentimento com Gemini");
    }
}
export const getDiaryByIdService = async(id: string) => {
    return await prisma.diaryEntry.findUnique({
        where: {
            id,
        },
    });
}

export const getAllDiariesByUserIdService = async(userId: string) => {
    return await prisma.diaryEntry.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
}

