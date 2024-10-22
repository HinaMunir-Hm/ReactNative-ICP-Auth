import "react-native-get-random-values";
import React, { createContext, useState, useContext, useEffect } from "react";
import * as Linking from "expo-linking";
import InAppBrowser from "react-native-inappbrowser-reborn";
import {
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  isDelegationValid,
} from "@dfinity/identity";
import { rootNavigate } from "../config/RootNavigation";
import { expoEnv } from "../config/expo-env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeDelegation } from "../config/AuthStorage";
import { toHex } from "@dfinity/agent";
import * as SecureStore from "expo-secure-store";

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}
// Create the AuthContext
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [baseKey, setBaseKey] = useState();
  const [isReady, setIsReady] = useState(false);

  /**
   * @type {[DelegationIdentity | null, React.Dispatch<DelegationIdentity | null>]} state
   */
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    assignBaseKey();
  }, []);
  const assignBaseKey = async () => {
    const storedKey = await SecureStore.getItemAsync("baseKey");
    if (storedKey) {
      setBaseKey(Ed25519KeyIdentity.fromJSON(storedKey));
    } else {
      const key = Ed25519KeyIdentity.generate();
      setBaseKey(key);
      await save("baseKey", JSON.stringify(key.toJSON()));
    }

    const storedDelegation = await AsyncStorage.getItem("delegation");
    if (storedDelegation) {
      const chain = DelegationChain.fromJSON(JSON.parse(storedDelegation));
      if (isDelegationValid(chain)) {
        const id = new DelegationIdentity(
          Ed25519KeyIdentity.fromJSON(storedKey),
          DelegationChain.fromJSON(JSON.parse(storedDelegation))
        );
        setIdentity(id);
      } else {
        await SecureStore.deleteItemAsync("delegation");
      }
    }
    setIsReady(true);
  };

  const login = async (requestFor) => {
    if (baseKey === undefined) {
      await assignBaseKey();
    }

    const derKey = toHex(baseKey.getPublicKey().toDer());
    const redirectUri = Linking.createURL("Auth/home"); //"exp+expo-template-default://expo-development-client/?url=http%3A%2F%2F192.168.0.105%3A8081";//

    console.log(redirectUri, " ......");

    const authUrl = `https://${
      expoEnv.EXPO_PUBLIC_CANISTER_ID_ICP_AUTH_FRONTEND
    }.icp0.io/?redirect_uri=${encodeURIComponent(
      redirectUri
    )}&requestFor=${requestFor}&pubkey=${derKey}`;

    console.log(authUrl, " authUrl");
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(authUrl, redirectUri, {
          // Customize your in-app browser options
          dismissButtonStyle: "cancel",
          readerMode: false,
          animated: true,
          modalPresentationStyle: "fullScreen",
          modalEnabled: true,
          enableBarCollapsing: false,
          showTitle: true,
        });

        if (result.type === "success" && result.url) {
          const token = extractTokenFromUrl(result.url);
          setUser(token); // Store the token
          const search = new URLSearchParams(result.url?.split("?")[1]);
          const delegation = search.get("delegation");
          if (delegation) {
            const chain = DelegationChain.fromJSON(
              JSON.parse(decodeURIComponent(delegation))
            );
            /**
             * @type {DelegationIdentity}
             */
            const id = DelegationIdentity.fromDelegation(baseKey, chain);

            //TODO: STORE IDENTITY HERE
            setIdentity(id);
            storeDelegation(id);
            //TODO: ADD REDIRECT
            rootNavigate("Auth", { screen: "home" });
            // InAppBrowser.closeAuth();
          }
        }
      } else {
        // Handle fallback if InAppBrowser is not available
        console.log("InAppBrowser not available");
      }
    } catch (error) {
      console.error("Error with in-app browser:", error);
    }
  };

  const extractTokenFromUrl = (url) => {
    const match = url.match(/access_token=([^&]+)/);
    return match ? match[1] : null;
  };

  return (
    <AuthContext.Provider value={{ login, user, identity, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
