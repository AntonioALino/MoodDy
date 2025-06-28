import { prisma } from "../../database/Prisma";

export const createDiaryService = async(userId: string, text: string, ) => {
    return await prisma.diaryEntry.create({
        data: {
            userId,
            text,
        }
    });
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

