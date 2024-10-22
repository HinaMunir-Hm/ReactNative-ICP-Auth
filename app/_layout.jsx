import { SplashScreen, Stack } from "expo-router";
import { AuthProvider } from "../context/Auth";
import Onboard from "./index";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "../config/RootNavigation";
import * as Linking from "expo-linking";
import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HiddenHeaderSettings } from "../components/reuseable";
import AuthLayout from "./(auth)/_layout";


const NavigationStack = createStackNavigator();

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const prefix = Linking.createURL("");

export default function RootLayout() {
  const handleDeepLink = (event) => {
    let data = Linking.parse(event.url);
  };
  const linking = {
    prefixes: [prefix, "auth://"],
    // Custom function to subscribe to incoming links
    subscribe(listener) {
      // Listen to incoming links from deep linking
      const linkingSubscription = Linking.addEventListener("url", (url) => {
        handleDeepLink(url);
      });

      return () => {
        // Clean up the event listeners

        linkingSubscription.remove();
      };
    },
    config: {
      screens: {
        // Auth: {
        //   path: "Auth",
        //   screens: {
        //     authenticate: "authenticate",
        //     customize: "customize",
        //   },
        // },
       
      },
    },
  };

  useEffect(() => {
    const subscription = Linking.addEventListener("url", handleDeepLink);
    SplashScreen.hideAsync();
    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <AuthProvider>
    <NavigationContainer
                  linking={linking}
                  independent={true}
                  ref={navigationRef}
                >
                  <NavigationStack.Navigator initialRouteName="index">
                    <NavigationStack.Screen
                      name="index"
                      component={Onboard}
                      options={HiddenHeaderSettings}
                    />
                    <NavigationStack.Screen
                      name="Auth"
                      component={AuthLayout}
                      options={HiddenHeaderSettings}
                    />
                    
                  </NavigationStack.Navigator>
                </NavigationContainer>
                <StatusBar
                  backgroundColor={"black"}
                  style="light"
                />
    </AuthProvider>
  );
}
