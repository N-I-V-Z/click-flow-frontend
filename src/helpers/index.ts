import helper_is from './is';
import helper_get from './get';
import dateandtime from 'date-and-time';
import { jwtDecode } from 'jwt-decode';
import { TokenDecoded } from '@/types';
import { useSearchParams } from 'react-router-dom';
/**
 * Helpers
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class helpers {
  usePaginationParams = (): { pageIndex: number; pageSize: number } => {
    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get('page')) || 1; // Mặc định là 1 nếu không có
    const limit = Number(searchParams.get('limit')) || 10; // Mặc định là 10 nếu không có

    return { pageIndex: page, pageSize: limit };
  };
  convertToDate(isoString) {
    const date = new Date(isoString);

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  }
  /**
   * Decode tokens,
   * @input tokens: string
   * @return object
   */

  decodeTokens(): TokenDecoded {
    const token = __helpers.cookie_get('AT') as string;
    const decodedToken = jwtDecode<TokenDecoded>(token);
    return decodedToken;
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
    for (const key in _self) {
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
  debounce<T extends (...args: any[]) => void>(callback: T, wait: number) {
    let timeoutId: number | undefined;

    return (...args: Parameters<T>) => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        callback(...args);
      }, wait);
    };
  }

  /**
   * Filter empty element in an object, remove empty string, null and undefined
   * @param object object
   */
  filterEmptyObject<T extends Record<string, any>>(_object: T): T {
    const final_after_filter: Partial<T> = {};

    for (const property in _object) {
      const val = _object[property];
      if (val === '' || val === undefined || val === null) continue;

      final_after_filter[property] = val; // Gán trực tiếp thay vì spread
    }

    return final_after_filter as T; // Ép kiểu về T để tránh lỗi TypeScript
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
    const end = String(input_string || ' ').substring(
      input_string.length - back
    );

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
    const num = Number(n);
    if (isNaN(num)) throw new Error('Invalid number input');

    return new Intl.NumberFormat('en-US').format(num);
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

    if (parts.length >= 2) {
      const lastPart = parts.pop();
      return lastPart ? lastPart.split(';').shift() : undefined;
    }

    return undefined;
  }

  /**
   * Cookie delete
   * @param name String
   */
  cookie_delete(name: string): void {
    document.cookie = `${name}=;SameSite=Lax;path=/;Max-Age=-99999999;`;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
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
