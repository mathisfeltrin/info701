import { newUserValidator } from "./../middleware/validator";
import {
  adminReponse,
  createUser,
  privateReponse,
  sendProfile,
  signin,
} from "./../controllers/auth";
import { RequestHandler, Router } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import UserModel from "@/models/user";

const authRouter = Router();

declare global {
  namespace Express {
    interface Request {
      user: {
        [key: string]: any;
      };
    }
  }
}

// const isAuth: RequestHandler = async (req, res, next) => {
const isAuth: RequestHandler = async (req: any, res: any, next: any) => {
  try {
    const authorizationToken = req.headers.authorization;
    const token = authorizationToken?.split("Bearer ")[1];
    if (!token) return res.status(403).json({ error: "unauthorized access!" });

    const payload = jwt.verify(token, "secret") as { id: string };

    const user = await UserModel.findById(payload.id);
    if (!user) return res.status(403).json({ error: "unauthorized access!" });

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(403).json({ error: "unauthorized access!" });
    } else {
      res.status(500).json({ error: "Something went wrong!" });
    }
  }
};

const isAdmin: RequestHandler = async (req, res, next) => {
  if (req.user.role === "admin") next();
  else res.status(403).json({ error: "Protected only for admin!" });
};

authRouter.post("/signup", newUserValidator, createUser);
authRouter.post("/signin", newUserValidator, signin);
authRouter.get("/profile", isAuth, sendProfile);
authRouter.get("/private", isAuth, privateReponse);
authRouter.get("/admin", isAuth, isAdmin, adminReponse);

export default authRouter;
