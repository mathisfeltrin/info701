import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { FC, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  Pressable,
  Text,
} from "react-native";
import { AuthContext } from "../context/AuthProvider";

import { AuthNavigatorTypes } from "../navigation/AuthNavigator";
import { signinUrl } from "../url";

interface Props {}

const SignIn: FC<Props> = (props) => {
  const { navigate } = useNavigation<NavigationProp<AuthNavigatorTypes>>();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const { updateAuthState } = useContext(AuthContext);

  const handleSignin = async () => {
    try {
      // Valide que l'email et le mot de passe ne sont pas vides
      if (!userInfo.email || !userInfo.password) {
        throw new Error("L'email et le mot de passe sont requis.");
      }

      const signInRes = await fetch(signinUrl, {
        method: "POST",
        body: JSON.stringify(userInfo),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Vérifie que le serveur renvoie bien une réponse JSON
      const contentType = signInRes.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const apiResJson = (await signInRes.json()) as {
          profile: { name: string; email: string; role: "admin" | "user" };
          token: string;
        };

        // Mets à jour l'état d'authentification
        updateAuthState({ loggedIn: true, profile: apiResJson.profile });

        // Sauvegarde le token dans AsyncStorage
        await AsyncStorage.setItem("auth_token", apiResJson.token);

        console.log("Connexion réussie !");
      } else {
        // Si la réponse n'est pas JSON, lève une erreur
        throw new Error("La réponse du serveur n'est pas du JSON.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={userInfo.email}
        onChangeText={(email) => setUserInfo({ ...userInfo, email })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={userInfo.password}
        onChangeText={(password) => setUserInfo({ ...userInfo, password })}
        secureTextEntry
      />
      <Button title="Signin" onPress={handleSignin} />

      <Pressable onPress={() => navigate("signup")}>
        <Text style={styles.link}>I am new signup</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
  },
  input: {
    padding: 5,
    borderWidth: 2,
    marginVertical: 20,
  },
  link: {
    color: "blue",
    fontSize: 20,
    paddingVertical: 10,
  },
});

export default SignIn;
