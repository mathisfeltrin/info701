import { Router } from "express";
import {
  createDelivery,
  getDeliveries,
  getDeliveryById,
  updateDelivery,
  deleteDelivery,
  updatePresence,
  updateDisponibility,
  updateFrais,
  updateConfig,
  updateArrivalDate,
  updateQualityControlDate,
  updatePayement,
  updateVirement,
  updateDateLivraison,
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

// Mettre à jour la disponibilité d'une livraison
deliveryRouter.put("/:id/disponibility", updateDisponibility);

// Mettre à jour les frais d'une livraison
deliveryRouter.put("/:id/frais", updateFrais);

// Mettre à jour la configuration d'une livraison
deliveryRouter.put("/:id/config", updateConfig);

// Mettre à jour la date d'arrivée d'une livraison
deliveryRouter.put("/:id/arrivalDate", updateArrivalDate);

// Mettre à jour la date de controle de qualité d'une livraison
deliveryRouter.put("/:id/qualityControlDate", updateQualityControlDate);

// Mettre à jour le payment d'une livraison
deliveryRouter.put("/:id/payement", updatePayement);

// Mettre à jour le virement d'une livraison
deliveryRouter.put("/:id/virement", updateVirement);

// Mettre à jour la date de livraison
deliveryRouter.put("/:id/dateLivraison", updateDateLivraison);

export default deliveryRouter;
