## Repo URL
https://github.com/HinaMunir-Hm/react-native-expo-icp-dfinity-auth
# Introduction 👋
This project is a React Native Expo app integrated with Dfinity's Internet Identity (II) and NFID for authentication. Since native support for these identity providers is unavailable in React Native, a frontend canister handles the authentication flow. The app uses InAppBrowser to initiate the login process, and the verified identity is passed back to the app from the frontend canister.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Run frontend canister on playground in a separate terminal

   ```bash
    npm run deployCanisters
   ```
3. Build the app 
   ```bash
       android -> "expo run:android"
      ios-> "expo run:ios"
   ```
## Next Steps

Once a user is authorized, you can now create an actor using the sample code below:
   ```bash
   import { createActor } from "../declarations/canister"; // Adjust the path as needed
   const { identity } = useAuth();
   
   const userActor = createActor(canisterID, {
     agentOptions: {
       identity: identity,  // Use the user's authenticated identity
       host: "https://icp0.io",
     },
     callOptions: {
       reactNative: {
         textStreaming: true,  // Enable text streaming for better performance
       },
     },
     fetchOptions: {
       reactNative: {
         __nativeResponseType: "base64",  // Handle native responses in base64 encoding
       },
     },
   });

   ```
 For above code sample, make sure to import createActor from the canister's generated declarations.
