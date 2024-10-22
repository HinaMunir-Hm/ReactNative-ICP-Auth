import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";

import "../polyfills";

import { checkSession } from "../config/AuthStorage";
import { CardOverLayView } from "../components/reuseable";

const Onboard = () => {
  useEffect(() => {
    checkSession();
    console.log("checked")
  }, []);

  return <CardOverLayView />;
};

export default Onboard;

const styles = StyleSheet.create({});
