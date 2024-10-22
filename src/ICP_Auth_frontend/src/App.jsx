import { useEffect, useState } from "react";
import { AuthClient } from "@dfinity/auth-client";
import { SignIdentity, fromHex } from "@dfinity/agent";
import { Ed25519KeyIdentity, Ed25519PublicKey } from "@dfinity/identity";
import IncompleteEd25519KeyIdentity from "./IncompletedEd25519KeyIdentity";

function App() {
  const [greeting, setGreeting] = useState("");
  const { redirectUri, requestFor, identity_ } = parseParams();
  const [identity, setIdentity] = useState();
  const [authClient, setAuthClient] = useState(null);

  // Initialize the AuthClient on mount
  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create({ identity: identity_ });
      setAuthClient(client);
    };
    initAuthClient();
  }, [identity_]);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      // create an auth client
      // let authClient = await AuthClient.create({ identity: identity_ });

      //choose provider
      const APP_NAME = "ICP-Auth";
      const APP_LOGO = "/hive.png";
      const CONFIG_QUERY = `?applicationName=${APP_NAME}&applicationLogo=${APP_LOGO}`;

      const identityProvider =
        requestFor === "internetIdentity"
          ? // ? process.env.DFX_NETWORK === "ic"
            "https://identity.ic0.app"
          : // : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`
            `https://nfid.one/authenticate${CONFIG_QUERY}`;

      // start the login process and wait for it to finish

      authClient.login({
        identityProvider: identityProvider,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
        // process.env.DFX_NETWORK === "ic"
        //   ? "https://identity.ic0.app"
        //   : `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943`,
        onSuccess: async () => {
          // At this point we're authenticated, and we can get the identity from the auth client:
          const identity = authClient.getIdentity();

          console.log(identity);

          var delegationString = JSON.stringify(
            identity.getDelegation().toJSON()
          );

          const encodedDelegation = encodeURIComponent(delegationString);
          setIdentity(encodedDelegation);
          const url = `${redirectUri}?delegation=${encodedDelegation}`;
          console.log(`Redirecting to ${url}`);
          let delegation = encodedDelegation;
          window.location.href = url;
        },
        onError: (err) => {
          console.error("Login failed:", err);
          // alert("Login failed. Please try again.");
        },
      });
    } catch (ex) {
      console.log("err submit", ex);
    }
  };

  /**
   * Parses the query string parameters from the URL.
   * @returns {{redirectUri: string;requestFor:string; identity_: SignIdentity}} The parsed query string parameters.
   */
  function parseParams() {
    try {
      const url = new URL(window.location.href);
      const redirectUri = decodeURIComponent(
        url.searchParams.get("redirect_uri")
      );
      const requestFor = url.searchParams.get("requestFor");
      const pubKey = url.searchParams.get("pubkey");
      if (!redirectUri) {
        // || !pubKey) {
        renderError(
          new Error("Missing redirect_uri or pubkey in query string")
        );
        throw new Error("Missing redirect_uri or pubkey in query string");
      }
      const identity_ = new IncompleteEd25519KeyIdentity(
        Ed25519PublicKey.fromDer(fromHex(pubKey))
      );

      return { redirectUri, requestFor, identity_ };
    } catch (ex) {
      console.log("err parse:: ", ex);
    }
  }
  const handleReturn = async () => {
    // e.preventDefault();
    const { redirectUri } = parseParams();
    const url = `${redirectUri}?delegation=${identity}`;
    console.log(`Redirecting to ${url}`);
    window.location.href = url;
    return;
  };

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div
        style={{
          marginTop: "5rem",
          border: "0.1px solid lightgrey",
          paddingTop: "0rem",
          paddingBottom: "1rem",
          borderRadius: "1rem",
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            background:
              "linear-gradient(90deg,rgba(100,139,237,1) 0%,rgba(183,140,242,1) 40%, rgba(147,42,239,1) 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <img src="/favicon.ico" />
            <p>AUTHENTION</p>
          </div>
        </div>
        <p style={{ fontSize: "1rem", textAlign: "center", marginTop: "2rem" }}>
          {identity === undefined
            ? "Choose authorize to get identity"
            : "Click on the below button to open app"}
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "1rem",
          }}
        >
          <div>
            {identity === undefined ? (
              <button
                style={{
                  marginTop: "0.5rem",
                  width: "15rem",
                  height: "2.5rem",
                  background: "white",
                  //  "linear-gradient(90deg,rgba(100,139,237,1) 0%,rgba(183,140,242,1) 40%, rgba(147,42,239,1) 100%)",
                  border: "0.1px solid lightgrey",
                  color: "#890eed",
                  fontSize: "1rem",
                  borderRadius: "0.4rem",
                }}
                onClick={handleSubmit}
              >
                Authorize Identity
              </button>
            ) : (
              <button
                style={{
                  marginTop: "0.5rem",
                  width: "15rem",
                  height: "2.5rem",
                  background: "white",
                  //  "linear-gradient(90deg,rgba(100,139,237,1) 0%,rgba(183,140,242,1) 40%, rgba(147,42,239,1) 100%)",
                  border: "0.1px solid lightgrey",
                  color: "#890eed",
                  fontSize: "1rem",
                  borderRadius: "0.4rem",
                }}
                onClick={handleReturn}
              >
                Return Identity
              </button>
            )}
          </div>
        </div>
        <p
          style={{
            fontSize: "0.8rem",
            textAlign: "center",
            marginTop: "2rem",
            paddingLeft: "2rem",
            paddingRight: "2rem",
          }}
        >
          {requestFor === "internetIdentity"
            ? "Since 2021, Internet Identity has combined secure passkey technology with the Internet Computer to keep you safe."
            : "Secured on decentralized architecture built by 100s of the world’s best cryptographers."}
        </p>
      </div>
    </main>
  );
}

export default App;
