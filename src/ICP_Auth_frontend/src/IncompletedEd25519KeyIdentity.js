import { SignIdentity } from "@dfinity/agent";

export default class IncompleteEd25519KeyIdentity extends SignIdentity {
    constructor(publicKey) {
      super();
      this._publicKey = publicKey;
    }

    getPublicKey() {
      return this._publicKey;
    }
  }