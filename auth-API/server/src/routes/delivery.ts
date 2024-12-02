import { Router } from "express";
import {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  updatePresence,
} from "../controllers/delivery";

const deliveryRouter = Router();

// Créer une nouvelle livraison
deliveryRouter.post("/", createDelivery);

// Récupérer toutes les livraisons
deliveryRouter.get("/", getDeliveries);

// Récupérer une livraison par ID
deliveryRouter.get("/:id", getDeliveryById);

// Mettre à jour une livraison par ID
deliveryRouter.put("/:id", updateDelivery);

// Supprimer une livraison par ID
deliveryRouter.delete("/:id", deleteDelivery);

// Mettre à jour la présence d'une livraison
deliveryRouter.put("/:id/presence", updatePresence);

export default deliveryRouter;
