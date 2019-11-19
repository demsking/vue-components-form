import { Dict } from '@/types';

export const Objects = {
  isObject(value: unknown) {
    return Objects.isGenericObject(value) && !Array.isArray(value);
  },

  isGenericObject(value: unknown) {
    return value !== null && typeof value === 'object';
  },

  equal(x: Dict<any>, y: Dict<any>) {
    if (x === y) {
      return true;
    }

    if ((typeof x === 'object' && x != null) && (typeof y === 'object' && y !== null)) {
      if (Object.keys(x).length !== Object.keys(y).length) {
        return false;
      }

      for (const prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (!Objects.equal(x[prop], y[prop])) {
            return false;
          }
        } else {
          return false;
        }
      }

      return true;
    }

    return false;
  },

  assign<T extends Dict = Dict<any>>(dest: any, src: T): T {
    Object.keys(src).forEach((key) => {
      const value = src[key];

      if (!Objects.isObject(value) || typeof value === 'function') {
        dest[key] = value;
      } else if (value instanceof Array) {
        dest[key] = [ ...value ];
      } else {
        if (!dest[key]) {
          dest[key] = {};
        }

        Objects.assign(dest[key], value as any);
      }
    });

    return dest;
  },

  clone(value: any) {
    if (Objects.isObject(value)) {
      const object = value instanceof Array ? [] : {};

      return Objects.assign(object, value as any);
    }

    return value;
  },

  isEmpty<T extends Dict = Dict<any>>(object: T) {
    for (const key in object) {
      return false;
    }

    return true;
  },

  clear<T extends Dict = Dict<any>>(object: T) {
    for (const key in object) {
      delete object[key];
    }
  }
};
