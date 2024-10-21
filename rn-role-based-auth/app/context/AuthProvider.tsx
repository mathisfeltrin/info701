import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { profileUrl } from "../url";

type profile = { name: string; email: string; role: "admin" | "user" };

interface AuthState {
  loggedIn: boolean;
  profile: profile | null;
}

interface Props {
  children: ReactNode;
}

interface AuthContext extends AuthState {
  updateAuthState(state: AuthState): void;
  logout(): Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  loggedIn: false,
  profile: null,
  updateAuthState() {},
  logout: async () => {},
});

const AuthProvider: FC<Props> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    loggedIn: false,
    profile: null,
  });

  const updateAuthState = (state: AuthState) => {
    setAuthState({ ...state });
  };

  const getAuthState = async () => {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) return;

    const profileRes = await fetch(profileUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const apiResJson = (await profileRes.json()) as {
      profile: { name: string; email: string; role: "admin" | "user" };
      token: string;
    };

    if (apiResJson.profile) {
      updateAuthState({ loggedIn: true, profile: apiResJson.profile });
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("auth_token");
    updateAuthState({ loggedIn: false, profile: null });
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        updateAuthState,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
