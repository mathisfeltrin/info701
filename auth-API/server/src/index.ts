import express from "express";
import "src/db";
import authRouter from "./routes/auth";
import deliveryRouter from "./routes/delivery";

const app = express();

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Définition des routes
app.use("/auth", authRouter); // Routes pour l'authentification
app.use("/deliveries", deliveryRouter); // Routes pour les livraisons

// Route par défaut
app.get("/", (req, res) => {
  res.json({ message: "Bienvenue sur l'API !" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
