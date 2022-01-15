import * as Keychain from 'react-native-keychain';
import { randomBytes } from 'react-native-randombytes';
import type { Response } from './interfaces';

export const failure = (data: string = '') => ({ error: true, data });
export const success = (data: string | object | any = '') => ({
  error: false,
  data,
});

export const setKeychainValue = async ({
  key = '',
  value = '',
} = {}): Promise<Response> => {
  return new Promise(async (resolve) => {
    try {
      const result = await Keychain.setGenericPassword(key, value, key);
      resolve(success(result));
    } catch (e: any) {
      resolve(failure(e));
    }
  });
};

export const getKeychainValue = async ({
  key = '',
} = {}): Promise<Response> => {
  return new Promise(async (resolve) => {
    try {
      const result = await Keychain.getGenericPassword(key);
      resolve(success(result));
    } catch (e: any) {
      resolve(failure(e));
    }
  });
};

//WARNING: This will wipe the specified key from storage
export const resetKeychainValue = async ({
  key = '',
} = {}): Promise<Response> => {
  return new Promise(async (resolve) => {
    try {
      const result = await Keychain.resetGenericPassword(key);
      resolve(success(result));
    } catch (e: any) {
      resolve(failure(e));
    }
  });
};

/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
export const toCaps = (value = '', separator = ' ', split = '-') => {
  return value
    .split(split)
    .map((v) => v.charAt(0).toUpperCase() + v.substring(1))
    .reduce((a, b) => `${a}${separator}${b}`);
};

/**
 * Convert a string to bytes
 * @param  {string} str The input string in utf8
 * @return {Buffer}     The output bytes
 */
export const toBuffer = (str: String) => {
  if (typeof str !== 'string') {
    throw new Error('Invalid input!');
  }
  return Buffer.from(str, 'utf8');
};

/**
 * Generate a random hex encoded 256 bit entropy wallet password.
 * @return {Promise<string>} A hex string containing some random bytes
 */
export const secureRandomPassword = async () => {
  const bytes = await randomBytes(32);
  return Buffer.from(bytes.buffer).toString('hex');
};

/**
 * Take a nice little nap :)
 * @param  {number} ms The amount of milliseconds to sleep
 * @return {Promise<undefined>}
 */
export const nap = (ms = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
