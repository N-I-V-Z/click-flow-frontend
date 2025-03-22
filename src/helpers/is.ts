export default class helper_is {
  constructor() {}

  isDev(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  /** Check if date or string of date or timestamp is valid */
  isDate(_input: any): boolean {
    return new Date(_input).toString() !== 'Invalid Date';
  }

  /**
   * Check if it is mobile or not ...
   * @returns Boolean
   */
  isMobile(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  /**
   * Check if it is email
   * @param {*} email
   * @returns
   */
  isEmail(email: string | undefined): boolean {
    if (typeof email === 'undefined') {
      return false;
    }
    email = String(email || ' ').trim();

    const filter = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]{2,4}$/;

    return filter.test(email);
  }

  /**
   * Check if String can be a boolean value, valid: true, "true"
   * @param {*} s
   */
  isBoolean(s: any) {
    const a = String(s || ' ');
    return a === 'true' || a === 'false';
  }

  /**
   * Check if it is number only
   * @param {*} num
   */
  isNumber(inputValue: any) {
    return Boolean(new RegExp('^[0-9]+$', 'g').test(inputValue));
  }

  /**
   * Check if it is JSON
   * @param {} str
   * @returns
   */
  isJson(str: string) {
    if (typeof str !== 'string') return false;
    try {
      const result = JSON.parse(str);
      const type = Object.prototype.toString.call(result);
      return type === '[object Object]' || type === '[object Array]';
    } catch (err) {
      return false;
    }
  }

  /**
   *	Check if it is a valid URL
   */
  isUrl(_string: any) {
    try {
      new URL(_string);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if it is array ...
   */
  isArray(_array: any) {
    return Array.isArray(_array);
  }

  /**
   * Check length of string
   */

  isMorethan(s: string | undefined, l: number) {
    if (s === void 0) s = '';
    if (l === void 0) l = 1;
    if (String(s).length > l) return true;
    return false;
  }

  /**
   * Check if less than X character
   * @param {*} s
   * @param {*} l
   * @returns
   */
  isLessthan(s: string | undefined, l: number) {
    if (typeof s === 'undefined') return false;
    if (l === void 0) l = 1;
    if (String(s).length < l) return true;
    return false;
  }

  /**
   * Check if object/array/string is empty or not
   * @param {*} array_or_object
   */
  isEmpty(array_or_object: object | [] | string) {
    if (!array_or_object) return true;
    if (array_or_object === void 0) return true;

    if (Array.isArray(array_or_object)) return array_or_object.length === 0;
    if (typeof array_or_object === 'object')
      return Object.keys(array_or_object).length === 0;

    return String(array_or_object).length === 0;
  }

  /**
   * Check if it is Object
   * @param {*} objectornot string or any to check
   */
  isObject(objectornot: any) {
    if (
      typeof objectornot === 'object' &&
      !Array.isArray(objectornot) &&
      objectornot !== null
    )
      return true;

    return false;
  }
}
