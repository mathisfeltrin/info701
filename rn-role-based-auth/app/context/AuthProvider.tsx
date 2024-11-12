import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { profileUrl } from "../url";

type profile = { name: string; email: string; role: "admin" | "user" };

interface AuthState {
  loggedIn: boolean;
  busy?: boolean;
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
    busy: true,
    profile: null,
  });

  const updateAuthState = (state: AuthState) => {
    setAuthState({ ...state });
  };

  const getAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("auth_token");
      if (!token) {
        updateAuthState({ loggedIn: false, profile: null, busy: false });
        return;
      }

      const profileRes = await fetch(profileUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!profileRes.ok) throw new Error("Failed to fetch profile");

      const apiResJson = await profileRes.json();
      if (apiResJson.profile) {
        updateAuthState({
          loggedIn: true,
          profile: apiResJson.profile,
          busy: false,
        });
      } else {
        updateAuthState({ loggedIn: false, profile: null, busy: false });
      }
    } catch (error) {
      console.error("Error fetching auth state:", error);
      updateAuthState({ loggedIn: false, profile: null, busy: false });
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
