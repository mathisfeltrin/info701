import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FC, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Text,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthProvider";
import { AuthNavigatorTypes } from "../navigation/AuthNavigator";
import { signinUrl } from "../url";

interface Props {}

const SignIn: FC<Props> = () => {
  const { navigate } = useNavigation<NavigationProp<AuthNavigatorTypes>>();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const { updateAuthState } = useContext(AuthContext);

  const handleSignin = async () => {
    try {
      if (!userInfo.email || !userInfo.password) {
        throw new Error("Email et mot de passe requis.");
      }

      const signInRes = await fetch(signinUrl, {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const contentType = signInRes.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const apiResJson = await signInRes.json();
        updateAuthState({ loggedIn: true, profile: apiResJson.profile });

        if (apiResJson.token) {
          await AsyncStorage.setItem("auth_token", apiResJson.token);
        }
      } else {
        throw new Error("Erreur lors de la connexion.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erreur:", error.message);
      } else {
        console.error("Erreur inconnue:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={userInfo.email}
        onChangeText={(email) => setUserInfo({ ...userInfo, email })}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={userInfo.password}
        onChangeText={(password) => setUserInfo({ ...userInfo, password })}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>

      <Pressable onPress={() => navigate("signup")}>
        <Text style={styles.link}>Créer un compte</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    color: "#007bff",
    fontSize: 16,
    marginTop: 20,
  },
});

export default SignIn;
