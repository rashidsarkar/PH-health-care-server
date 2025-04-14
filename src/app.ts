import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import { userRoutes } from "./modules/User/user.routes";
import { adminRoutes } from "./modules/Admin/admin.routes";
import router from "./routes";
import status from "http-status";
import globalErrorHandler from "./middleware/globalErrorHandler";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Ph Health care server",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    success: false,
    message: "Route not found",
    error: {
      path: req.originalUrl,
    },
  });
});
export default app;
