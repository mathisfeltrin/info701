import { Schema, model } from "mongoose";

interface DeliveryDocument extends Document {
  model: string; // Modèle de l'objet
  reference: string; // Référence unique de l'objet livré
  numeroId: string; // Numéro ID unique
  couleur: string; // Couleur associée
  sitePresence: string; // Site de présence physique
  siteDestination: string; // Site de destination
}

const deliverySchema = new Schema<DeliveryDocument>(
  {
    model: { type: String, required: true },
    reference: { type: String, required: true },
    numeroId: { type: String, required: true, unique: true },
    couleur: { type: String, required: true },
    sitePresence: { type: String, required: true },
    siteDestination: { type: String, required: true },
  },
  { timestamps: true }
);

const DeliveryModel = model<DeliveryDocument>("Delivery", deliverySchema);

export default DeliveryModel;
