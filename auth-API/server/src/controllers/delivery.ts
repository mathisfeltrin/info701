//import { updatePresence } from "./delivery";
import { Request, Response, RequestHandler, NextFunction } from "express";
import DeliveryModel from "../models/delivery";

// Créer une nouvelle livraison
export const createDelivery: RequestHandler = async (req: any, res: any) => {
  try {
    const {
      name,
      model,
      reference,
      numeroId,
      couleur,
      sitePresence,
      siteDestination,
      presence,
      disponible,
      frais,
      config,
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
      name,
      model,
      reference,
      numeroId,
      couleur,
      sitePresence,
      siteDestination,
      presence,
      disponible,
      frais,
      config,
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

// Mettre à jour la présence d'une livraison
export const updatePresence: RequestHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { presence } = req.body; // Passez `presence` dans le corps de la requête

    if (typeof presence !== "boolean") {
      return res
        .status(400)
        .json({ message: "La propriété presence doit être un booléen" });
    }

    // Mise à jour de la propriété `presence`
    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      id,
      { presence },
      { new: true } // Retourne la version mise à jour
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Livraison introuvable" });
    }

    res.status(200).json({
      message: `Présence mise à jour avec succès à ${presence}`,
      delivery: updatedDelivery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la présence",
      error,
    });
  }
};

// Mettre à jour la disponibilité d'une livraison
export const updateDisponibility: RequestHandler = async (
  req: any,
  res: any
) => {
  try {
    const { id } = req.params;
    const { disponible } = req.body; // Passez `disponible` dans le corps de la requête

    // if (typeof disponible !== "string") {
    //   return res
    //     .status(400)
    //     .json({ message: "La propriété disponible doit être un booléen" });
    // }

    // Mise à jour de la propriété `presence`
    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      id,
      { disponible },
      { new: true } // Retourne la version mise à jour
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Livraison introuvable" });
    }

    res.status(200).json({
      message: `Disponibilité mise à jour avec succès à ${disponible}`,
      delivery: updatedDelivery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la disponibilité",
      error,
    });
  }
};

// Mettre à jour les frais d'une livraison
export const updateFrais: RequestHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { frais } = req.body; // Passez `presence` dans le corps de la requête

    if (typeof frais !== "boolean") {
      return res
        .status(400)
        .json({ message: "La propriété frais doit être un booléen" });
    }

    // Mise à jour de la propriété `presence`
    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      id,
      { frais },
      { new: true } // Retourne la version mise à jour
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Livraison introuvable" });
    }

    res.status(200).json({
      message: `Frais mise à jour avec succès à ${frais}`,
      delivery: updatedDelivery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour des frais",
      error,
    });
  }
};

// Mettre à jour la configuration d'une livraison
export const updateConfig: RequestHandler = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { config } = req.body; // Passez `config` dans le corps de la requête

    if (typeof config !== "string") {
      return res
        .status(400)
        .json({ message: "La propriété presence doit être un booléen" });
    }

    // Mise à jour de la propriété `presence`
    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      id,
      { config },
      { new: true } // Retourne la version mise à jour
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Livraison introuvable" });
    }

    res.status(200).json({
      message: `Présence mise à jour avec succès à ${config}`,
      delivery: updatedDelivery,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la présence",
      error,
    });
  }
};
