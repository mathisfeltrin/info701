import { NavigationContainer } from "@react-navigation/native";
import { FC } from "react";
import AuthProvider from "./app/context/AuthProvider";
import Navigator from "./app/navigation";

interface Props {}

const App: FC<Props> = (props) => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
