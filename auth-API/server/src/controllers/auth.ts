import UserModel from "@/models/user";
import { Request, Response, RequestHandler, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const createUser: RequestHandler = async (req: any, res: any) => {
  const { email, name, password, role, site } = req.body;

  const oldUser = await UserModel.findOne({ email });

  if (oldUser)
    return res.status(403).json({ error: "this email is already use!" });

  // Vérifier si le rôle est valide
  const validRoles = [
    "vendeur",
    "RCO",
    "secretaire",
    "chauffeur",
    "expert_produit",
    "accessoiriste",
    "FM",
    "comptable",
  ];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Rôle non valide" });
  }

  // Vérifier si le site est valide
  const validSites = [
    "Annecy",
    "Aix Les Bains",
    "Chambéry",
    "Belley",
    "Paris",
    "Montpellier",
    "Six-Fours",
    "Thônes",
    "Lyon",
    "Marseille",
    "Nancy",
    "Strasbourg",
    "Lille",
  ];
  if (!validSites.includes(site)) {
    return res.status(400).json({ error: "Site non valide" });
  }

  // Continuer la création de l'utilisateur
  const newUser = new UserModel({ name, email, password, role, site });

  await newUser.save();

  res
    .status(201)
    .json({ message: "Utilisateur créé avec succès", user: newUser });

  // const user = await UserModel.create({ name, email, password });

  // res.json({ success: true, user: { email, name, id: user._id.toString() } });
};

export const getUserById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(404).json({ message: "Utilisateur introuvable" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération de l'utilisateur'",
        error,
      });
  } finally {
    next();
  }
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
    profile: {
      name: user.name,
      role: user.role,
      email: user.email,
      site: user.site,
    },
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
      site: req.user.site,
    },
  });
};
