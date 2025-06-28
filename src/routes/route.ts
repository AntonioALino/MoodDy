import express, { Application } from "express";
import cors from 'cors'
import UserRoutes from '../routes/Users/UsersRoutes';
import DiaryRoutes from '../routes/Diary/DiaryRoutes';

const createServerApplication = (): Application => {

    const app = express();

    app.use(express.json());

    app.use(cors({}));

    app.use("/api", UserRoutes)

    app.use("/api", DiaryRoutes)

    return app;

}

export default createServerApplication;