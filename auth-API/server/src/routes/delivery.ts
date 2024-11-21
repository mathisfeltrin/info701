import { Router } from "express";
import {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
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

export default deliveryRouter;
