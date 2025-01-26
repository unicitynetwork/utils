const CryptoJS = require('crypto-js');
const objectHash = require('object-hash');

/**
 * Hash function that accepts multiple input parameters (String, WordArray or BigInt).
 * Converts BigInt into WordArray, concatenates all inputs, hashes, and returns a WordArray.
 * 
 * @param {...(CryptoJS.lib.WordArray | BigInt)} inputs - Parameters to hash.
 * @returns {CryptoJS.lib.WordArray} - The resulting SHA256 hash as a WordArray.
 */
function smthash(...inputs) {

  // Concatenate all inputs into a single WordArray
  const concatenatedWordArray = inputs.reduce((acc, input) => {
    if (typeof input === "bigint") {
      // Convert BigInt to WordArray
      input = bigIntToWordArray(input);
    } else if (typeof input === "string") {
      // Convert string to WordArray
      input = stringToWordArray(input);
    } else if (input === null) {
      // Null value as bigint 0
      input = bigIntToWordArray(0n);
    } else if (!CryptoJS.lib.WordArray.isPrototypeOf(input)) {
      throw new Error("Invalid input: must be a BigInt or CryptoJS.lib.WordArray.");
    }
    // Append to accumulator
    return acc.concat(input);
  }, CryptoJS.lib.WordArray.create());

  // Hash the concatenated WordArray and return the result
  return CryptoJS.SHA256(concatenatedWordArray);
}

// Helper function to convert BigInt to WordArray
function bigIntToWordArray(bigInt) {
    // Convert BigInt to Hex String
    let hexString = bigInt.toString(16);
    // Ensure even length for Hex String
    if (hexString.length % 2 !== 0) {
      hexString = "0" + hexString;
    }
    // Convert Hex String to WordArray
    return CryptoJS.enc.Hex.parse(hexString);
}

// Helper function to convert a string to WordArray
function stringToWordArray(string) {
    return CryptoJS.enc.Utf8.parse(string);
}

function isHexString(str) {
    return /^[0-9a-fA-F]+$/.test(str);
}

function hexToWordArray(hexStr){
    if(!isHexString(hexStr))
	throw new Error("This is not hex string: "+hexStr);
    return CryptoJS.enc.Hex.parse(hexStr);
//    const intVal = hexStr.startsWith('0x')?BigInt(hexStr):BigInt('0x'+hexStr);
//    return bigIntToWordArray(intVal);
}

function wordArrayToHex(wordArray){
    return wordArray?.toString(CryptoJS.enc.Hex);
}

function isWordArray(obj) {
    return CryptoJS.lib.WordArray.isPrototypeOf(obj);
}

function stringToHex(str){
    return wordArrayToHex(stringToWordArray(str));
}

function normalizeObject(obj){
    return stringToHex(objectHash(obj, {algorithm: "passthrough"}));
}

module.exports = {
    smthash,
    bigIntToWordArray,
    stringToWordArray,
    hexToWordArray,
    wordArrayToHex,
    isWordArray,
    isHexString,
    stringToHex,
    normalizeObject
}
