import UserModel from "@/models/user";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// export const createUser: RequestHandler = async (req, res) => {
export const createUser: RequestHandler = async (req: any, res: any) => {
  const { email, name, password } = req.body;

  const oldUser = await UserModel.findOne({ email });

  if (oldUser)
    return res.status(403).json({ error: "this email is already use!" });

  const user = await UserModel.create({ name, email, password });

  res.json({ success: true, user: { email, name, id: user._id.toString() } });
};

// export const signin: RequestHandler = async (req, res) => {
export const signin: RequestHandler = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found!" });

  const isMatched = await user.comparePassword(password);
  if (!isMatched) {
    return res.status(403).json({ error: "Email/password doesn't match!" });
  }

  // user is there and password is cool
  const token = jwt.sign({ id: user._id.toString() }, "secret");

  res.json({
    success: true,
    token,
    profile: { name: user.name, role: user.role, email: user.email },
  });
};

export const privateReponse: RequestHandler = async (req, res) => {
  res.json({ message: "cool man you are in the private property!" });
};

export const adminReponse: RequestHandler = async (req, res) => {
  res.json({ message: "Welcome boss I know you ar our admin!" });
};

export const sendProfile: RequestHandler = (req, res) => {
  res.json({
    profile: {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};
