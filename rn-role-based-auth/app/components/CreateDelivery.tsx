import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

interface DeliveryFormProps {
  onSubmit?: () => void; // Callback optionnel après création
}

const CreateDelivery: React.FC<DeliveryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    model: "",
    reference: "",
    numeroId: "",
    couleur: "",
    sitePresence: "",
    siteDestination: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://172.20.10.4:8000/deliveries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la livraison");
      }

      const data = await response.json();
      console.log("Livraison créée :", data);
      Alert.alert("Succès", "Livraison créée avec succès !");
      setFormData({
        model: "",
        reference: "",
        numeroId: "",
        couleur: "",
        sitePresence: "",
        siteDestination: "",
      });
      if (onSubmit) onSubmit();
    } catch (err) {
      setError((err as Error).message);
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer une Livraison</Text>
      {error && <Text style={styles.error}>{error}</Text>}
      <View style={styles.form}>
        {[
          { label: "Modèle", key: "model" },
          { label: "Référence", key: "reference" },
          { label: "Numéro ID", key: "numeroId" },
          { label: "Couleur", key: "couleur" },
          { label: "Site de Présence Physique", key: "sitePresence" },
          { label: "Site de Destination", key: "siteDestination" },
        ].map((field) => (
          <TextInput
            key={field.key}
            style={styles.input}
            placeholder={field.label}
            value={formData[field.key as keyof typeof formData]}
            onChangeText={(value) => handleChange(field.key, value)}
          />
        ))}
      </View>
      <Button
        title={loading ? "Création..." : "Créer"}
        onPress={handleSubmit}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="large" color="#007bff" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
});

export default CreateDelivery;
