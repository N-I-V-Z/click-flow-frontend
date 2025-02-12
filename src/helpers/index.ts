import helper_is from './is';
import helper_get from './get';
import dateandtime from 'date-and-time';
/**
 * Helpers
 */
class helpers {
  convertToDate(isoString) {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }

  /**
   * Caculate percent,
   * @input target: number, got: number
   * @return number * 100
   */
  caculatePercent(target: number | string, got: number | string): number {
    target = Number(target);
    got = Number(got);
    const r = ((got / target) * 100).toFixed(1);
    let rr = parseFloat(r);
    if (rr > 100) rr = 100;
    return rr;
  }

  /**
   * Filter object, null or undefined is ignore
   * @param _self
   * @returns
   */
  filterNullObject(_self: any) {
    const result: any = {};
    for (let key in _self) {
      if (_self[key] === null || _self[key] === undefined) continue;
      result[key] = _self[key];
    }
    return result;
  }

  /**
   * Revert buildEndUrl, parse URL to Object
   * Duplicate value will be overwrite, last value will taken
   * @param stringQuery URL SEARCH STRING
   */
  ExtractUrl(stringQuery: any): any {
    const searchParams = new URLSearchParams(stringQuery);
    let final_object = {};
    for (const [key, value] of searchParams.entries()) {
      final_object = {
        ...final_object,
        ...{
          [key]: value
        }
      };
    }
    return final_object;
  }

  /**
   * Caculate percentage
   * @param partialValue Number
   * @param totalValue Number
   * @returns
   */
  percentage(partialValue: number, totalValue: number) {
    partialValue = Number(partialValue);
    totalValue = Number(totalValue);
    if (totalValue === 0) return 0;
    return ((100 * partialValue) / totalValue).toFixed(2);
  }

  // lodash debounce ...
  debounce(callback: any, wait: number) {
    let timeoutId = null;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback.apply(null, args);
      }, wait);
    };
  }

  /**
   * Filter empty element in an object, remove empty string, null and undefined
   * @param object object
   */
  filterEmptyObject<T>(_object: T): T {
    let final_after_filter: T;
    for (let property in _object) {
      const val = _object[property];
      if (val === '' || val === undefined || val === null) continue;

      final_after_filter = {
        ...final_after_filter,
        ...{
          [property]: val
        }
      };
    }
    return final_after_filter;
  }

  /**
   * Trim middle string, eg: Hello xin chào...nhé bạn!
   * @param s String
   */
  trimMiddleString(
    input_string: string,
    front?: number,
    back?: number
  ): string {
    if (input_string === void 0) return '';
    if (!input_string) return '';
    if (front === void 0) front = 10;
    if (back === void 0) back = 10;
    if (input_string.length < 21) return input_string;

    const start = String(input_string || ' ').substring(0, front);
    const end = String(input_string || ' ').substring(input_string.length - back);

    return `${start} ...${end}`;
  }

  /**
   * Trim content string, eg: Hello xin chào...
   * @param s String
   */
  trimContentString(s: string, _length?: number): string {
    if (s === void 0) return '';
    if (!s) return '';
    if (_length === void 0) _length = 20;
    if (s.length < 21) return s;

    const start = String(s || ' ').substring(0, _length);

    return `${start}...`;
  }

  /**
   * Convert DateTime bigInt to number of days remain
   * Tính số ngày đã trôi qua, dương là số ngày trôi qua, số âm là chưa tới ngày
   * @param thatday bigint
   * @returns
   */
  subtractDate = (thatday: any, prefix?: string) => {
    if (!thatday || thatday < 1) return '';
    const today = dateandtime.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
    const tday = dateandtime.subtract(
      new Date(today),
      new Date(Number(thatday))
    );
    return Math.ceil(tday.toDays()) + (prefix ? ' ' + prefix : '');
  };

  /**
   * Format for money or you need something like easy to read long number
   * @param x
   * @returns
   */
  formatNumberWithCommas(n: string | number): string {
    n = this.parseNumeric(n);
    let isNegative = false;

    if (n < 0) {
      isNegative = true;
      n = Math.abs(n);
    }

    n = n.toString();
    const pattern = /(\d+)(\d{3})/;
    while (pattern.test(n)) {
      n = n.replace(pattern, '$1,$2');
    }

    return isNegative ? '-' + n : n;
  }

  /**
   * Cookie set
   */
  cookie_set(name: string, value: string, expire_day?: number): void {
    let expires = '';
    if (typeof expire_day !== 'undefined') {
      const d = new Date();
      d.setTime(d.getTime() + expire_day * 24 * 60 * 60 * 1000);
      expires = ';expires=' + d.toUTCString();
    }
    document.cookie = `${name}=${value};SameSite=Lax;path=/` + expires;
  }
  /**
   * Cookie get value
   * @param name
   * @returns
   */
  cookie_get(name: string): string | undefined {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length >= 2) return parts.pop().split(';').shift();
    return;
  }

  /**
   * Cookie delete
   * @param name String
   */
  cookie_delete(name: string): void {
    document.cookie = `${name}=;SameSite=Lax;path=/;Max-Age=-99999999;`;
  }
}

interface helpers extends helper_is, helper_get {}
const __helpers = new helpers();
export default __helpers;

/*******
 * Everything after here is for webpack!
 */

// copy the methods
Object.assign(helpers.prototype, new helper_is());
Object.assign(helpers.prototype, new helper_get());

/**
 * It is must be here because of webpack can not run without applyMixins
 * @param derivedCtor
 * @param constructors
 */

// the helper function
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}

applyMixins(helpers, [helper_is, helper_get]);
