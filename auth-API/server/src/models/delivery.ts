import { Schema, model } from "mongoose";

interface DeliveryDocument extends Document {
  name: string;
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
  presence: boolean;
  disponible: Date;
  frais: boolean;
}

const deliverySchema = new Schema<DeliveryDocument>(
  {
    name: { type: String, required: true },
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
    presence: { type: Boolean },
    disponible: { type: Date, default: null },
    frais: { type: Boolean },
  },
  { timestamps: true }
);

const DeliveryModel = model<DeliveryDocument>("Delivery", deliverySchema);

export default DeliveryModel;
