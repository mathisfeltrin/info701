import { Request, Response, RequestHandler, NextFunction } from "express";
import DeliveryModel from "../models/delivery";

// Créer une nouvelle livraison
export const createDelivery: RequestHandler = async (req: any, res: any) => {
  try {
    const {
      model,
      reference,
      numeroId,
      couleur,
      sitePresence,
      siteDestination,
    } = req.body;

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
    if (!validSites.includes(sitePresence)) {
      return res.status(400).json({ error: "Site non valide" });
    }
    if (!validSites.includes(siteDestination)) {
      return res.status(400).json({ error: "Site non valide" });
    }

    const newDelivery = new DeliveryModel({
      model,
      reference,
      numeroId,
      couleur,
      sitePresence,
      siteDestination,
    });

    await newDelivery.save();

    res
      .status(201)
      .json({ message: "Livraison créée avec succès", delivery: newDelivery });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création de la livraison", error });
  }
};

// Récupérer toutes les livraisons
export const getDeliveries: RequestHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const deliveries = await DeliveryModel.find();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des livraisons",
      error,
    });
  }
};

// Récupérer une livraison par ID
export const getDeliveryById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryModel.findById(id);

    if (!delivery) {
      res.status(404).json({ message: "Livraison introuvable" });
    } else {
      res.status(200).json(delivery);
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération de la livraison",
      error,
    });
  } finally {
    next();
  }
};

// Mettre à jour une livraison par ID
export const updateDelivery: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedDelivery) {
      res.status(404).json({ message: "Livraison introuvable" });
    } else {
      res.status(200).json({
        message: "Livraison mise à jour avec succès",
        delivery: updatedDelivery,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la livraison",
      error,
    });
  } finally {
    next();
  }
};

// Supprimer une livraison par ID
export const deleteDelivery: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const deletedDelivery = await DeliveryModel.findByIdAndDelete(id);

    if (!deletedDelivery) {
      res.status(404).json({ message: "Livraison introuvable" });
    } else {
      res.status(200).json({ message: "Livraison supprimée avec succès" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de la livraison",
      error,
    });
  } finally {
    next();
  }
};
