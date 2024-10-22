import React, { useState } from "react";
import { NavigationStack } from "../../config/RootNavigation";
import Home from "./home";
import Authentication from "./authentication";

import { StatusBar } from "expo-status-bar";
import { HiddenHeaderSettings } from "../../components/reuseable";

export default function AuthLayout() {
  return (
    <>
      <NavigationStack.Navigator initialRouteName="authenticate">
        <NavigationStack.Screen
          name="authenticate"
          component={Authentication}
          options={HiddenHeaderSettings}
        />

        <NavigationStack.Screen
          name="home"
          component={Home}
          options={HiddenHeaderSettings}
        />
      </NavigationStack.Navigator>
      <StatusBar backgroundColor={"black"} style="dark" />
    </>
  );
}
