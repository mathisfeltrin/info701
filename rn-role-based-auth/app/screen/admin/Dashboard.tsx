import AsyncStorage from "@react-native-async-storage/async-storage";
import { FC, useContext } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { AuthContext } from "../../context/AuthProvider";

interface Props {}

const Dashboard: FC<Props> = (props) => {
  const { updateAuthState, logout } = useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "bold", fontSize: 25 }}>
        Welcome to Admin Dashboard
      </Text>

      <Button onPress={logout} title="Logout" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "lightblue",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Dashboard;
