import AsyncStorage from "@react-native-async-storage/async-storage";
import { rootNavigate } from "./RootNavigation";
export const storeDelegation = async (identity) => {
  try {
    const delegation = JSON.stringify(identity.getDelegation().toJSON());
    // Get the expiry time as BigInt, convert to string
    const expiryBigInt =
      identity.getDelegation().delegations[0].delegation.expiration;
    const expiry = expiryBigInt.toString(); // Convert BigInt to string

    await AsyncStorage.setItem("delegation", delegation);
    await AsyncStorage.setItem("delegationExpiry", expiry.toString());
  } catch (error) {
    console.log("Error storing delegation:", error);
  }
};

export const isDelegationValid = async () => {
  try {
    const expiry = await AsyncStorage.getItem("delegationExpiry");
    if (!expiry) {
      return false; // No stored delegation
    }

    const expiryBigInt = BigInt(expiry); // Convert back to BigInt
    const milliseconds = Number(expiryBigInt / 1000000n);
    // Create a Date object from milliseconds
    const dateExpiry = new Date(milliseconds);
    const dateNow = new Date();
    if (dateNow >= dateExpiry) {
      return false; // Delegation expired
    }
    return true; // Delegation still valid
  } catch (error) {
    console.log("Error checking delegation validity:", error);
    return false;
  }
};

export const logOut = async () => {
  AsyncStorage.removeItem("delegation");
  AsyncStorage.removeItem("delegationExpiry");
  rootNavigate("Auth", { screen: "authenticate" });
};

export const checkSession = async () => {
  const isValid = await isDelegationValid();
  if (!isValid) {
    // Prompt user to authenticate again
    logOut();
    // rootNavigate("Auth", { screen: "authenticate" });
  } else {
    // Session is valid, proceed with user action
    rootNavigate("Auth", { screen: "home" });
  }
};
