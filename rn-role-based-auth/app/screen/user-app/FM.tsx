import { FC, useContext } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { AuthContext } from "../../context/AuthProvider";

interface Props {}

const FM: FC<Props> = (props) => {
  const { logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>
        Bienvenue dans la page FM
      </Text>

      <Button onPress={logout} title="Logout" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default FM;
