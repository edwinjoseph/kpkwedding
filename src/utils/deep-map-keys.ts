import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';

const deepMapKeys = <Obj extends Record<string, unknown>, T extends Record<string, unknown>>(obj: Obj, fn: (key: string) => string): T => {
    if (Array.isArray(obj)) {
        return obj.map((item) => deepMapKeys(item, fn)) as unknown as T;
    }

    if (isObject(obj)) {
        return reduce<Record<string, unknown>, Record<string, unknown>>(obj, (result, value, key) => {
            const newKey = fn(key);
            result[newKey] = deepMapKeys(value as Obj, fn);
            return result;
        }, {}) as T;
    }

    return obj;
};

export default deepMapKeys;
