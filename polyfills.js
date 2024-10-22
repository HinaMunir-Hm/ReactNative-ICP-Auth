// polyfills.js
import { TextDecoder, TextEncoder } from 'text-encoding';
import * as Crypto from 'expo-crypto';
import "react-native-get-random-values";

// Make sure TextDecoder is available globally
if (typeof global.TextDecoder === 'undefined') {
   global.TextDecoder = TextDecoder;
}

if (typeof global.TextEncoder === 'undefined') {
   global.TextEncoder = TextEncoder;
}

if (typeof global.crypto === 'undefined') {
   global.crypto = Crypto
}