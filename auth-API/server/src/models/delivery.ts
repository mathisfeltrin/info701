import { Schema, model } from "mongoose";

interface DeliveryDocument extends Document {
  model: string; // Modèle de l'objet
  reference: string; // Référence unique de l'objet livré
  numeroId: string; // Numéro ID unique
  couleur: string; // Couleur associée
  sitePresence:
    | "Annecy"
    | "Aix Les Bains"
    | "Chambéry"
    | "Belley"
    | "Paris"
    | "Montpellier"
    | "Six-Fours"
    | "Thônes"
    | "Lyon"
    | "Marseille"
    | "Nancy"
    | "Strasbourg"
    | "Lille"; // Site de présence physique
  siteDestination:
    | "Annecy"
    | "Aix Les Bains"
    | "Chambéry"
    | "Belley"
    | "Paris"
    | "Montpellier"
    | "Six-Fours"
    | "Thônes"
    | "Lyon"
    | "Marseille"
    | "Nancy"
    | "Strasbourg"
    | "Lille"; // Site de destination
}

const deliverySchema = new Schema<DeliveryDocument>(
  {
    model: { type: String, required: true },
    reference: { type: String, required: true },
    numeroId: { type: String, required: true, unique: true },
    couleur: { type: String, required: true },
    sitePresence: {
      type: String,
      enum: [
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
      ],
      default: "Annecy",
      required: true,
    },
    siteDestination: {
      type: String,
      enum: [
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
      ],
      default: "Annecy",
      required: true,
    },
  },
  { timestamps: true }
);

const DeliveryModel = model<DeliveryDocument>("Delivery", deliverySchema);

export default DeliveryModel;
