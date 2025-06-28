import { prisma } from "../../database/Prisma";

export const createUserService = async(email: string, password: string, name: string) => {
    return await prisma.user.create({
        data: {
            email,
            password,
            name
        }
    })
}

//Usado so para desenvolvimento
export const getUserByIdService = async(id: string) => {
    return await prisma.user.findUnique({
        where: {
            id
        },
        select:{
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            diaries: {
                select: {
                    id: true,
                    text: true,
                    createdAt: true,
                    updatedAt: true
                }
            }   
        }
    })
}

//Usado para o usuário final
export const getUserByEmailService = async(email: string) => {
    return await prisma.user.findUnique({
        where: {
            email
        }, select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
            updatedAt: true
        }
    })
}

export const deleteIUserByIdService = async(id: string) => {
    return await prisma.user.delete({
        where: {
            id
        }
    })
}