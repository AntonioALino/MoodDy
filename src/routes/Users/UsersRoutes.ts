import { Router } from "express";
import { 
    createUserController, 
    getUserByIdController, 
    getUserByEmailController, 
    deleteUserByIdController 
} from "../../controllers/Users/UsersControllers";

const router = Router();

router.post("/", createUserController);

router.get("/:id", getUserByIdController);

router.get("/email/:email", getUserByEmailController);

router.delete("/:id", deleteUserByIdController);

export default router;