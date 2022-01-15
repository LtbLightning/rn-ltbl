import type { Response } from './interfaces';
export declare const failure: (data?: string) => {
    error: boolean;
    data: string;
};
export declare const success: (data?: string | object | any) => {
    error: boolean;
    data: any;
};
export declare const setKeychainValue: ({ key, value, }?: {
    key?: string | undefined;
    value?: string | undefined;
}) => Promise<Response>;
export declare const getKeychainValue: ({ key, }?: {
    key?: string | undefined;
}) => Promise<Response>;
export declare const resetKeychainValue: ({ key, }?: {
    key?: string | undefined;
}) => Promise<Response>;
/**
 * Split '_' separated words and convert to uppercase
 * @param  {string} value     The input string
 * @param  {string} separator The separator to be used
 * @param  {string} split     The split char that concats the value
 * @return {string}           The words conected with the separator
 */
export declare const toCaps: (value?: string, separator?: string, split?: string) => string;
/**
 * Convert a string to bytes
 * @param  {string} str The input string in utf8
 * @return {Buffer}     The output bytes
 */
export declare const toBuffer: (str: String) => any;
/**
 * Generate a random hex encoded 256 bit entropy wallet password.
 * @return {Promise<string>} A hex string containing some random bytes
 */
export declare const secureRandomPassword: () => Promise<any>;
/**
 * Take a nice little nap :)
 * @param  {number} ms The amount of milliseconds to sleep
 * @return {Promise<undefined>}
 */
export declare const nap: (ms?: number) => Promise<unknown>;
