import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { 
    createUserService, 
    deleteIUserByIdService, 
    getUserByEmailService, 
    getUserByIdService } 
from "../../services/User/UserService";

export const createUserController = async (req: Request, res: Response) : Promise<any> => {
    const { email, password, name } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await createUserService(email, hashedPassword, name);

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserByIdController = async (req: Request, res: Response) : Promise<any> => {
    const { id } = req.params;

    try {
        const user = await getUserByIdService(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserByEmailController = async (req: Request, res: Response) : Promise<any> => {
    const { email } = req.params;

    try {
        const user = await getUserByEmailService(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const deleteUserByIdController = async (req: Request, res: Response) : Promise<any> => {
    const { id } = req.params;

    try {
        const user = await deleteIUserByIdService(id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};