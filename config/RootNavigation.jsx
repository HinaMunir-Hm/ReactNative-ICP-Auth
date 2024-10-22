// RootNavigation.js

import { createNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

export const NavigationStack = createStackNavigator();
export const navigationRef = createNavigationContainerRef();

export function rootNavigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}
export function rootBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
export function rootNav(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.resetRoot({
      index: 0,
      routes: [name],
    });
  }
}

export function goToInitialRoute() {
  let initialRoute = "index";
  if (navigationRef.isReady()) {
    navigationRef.navigate(initialRoute);
  }
}
