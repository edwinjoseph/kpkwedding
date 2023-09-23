import isObject from 'lodash/isObject';
import reduce from 'lodash/reduce';

const deepMapKeys = <Obj extends Record<string, any>, T extends Record<string, any>>(obj: Obj, fn: (key: string) => string): T => {
    if (Array.isArray(obj)) {
        return obj.map((item) => deepMapKeys(item, fn)) as unknown as T;
    }

    if (isObject(obj)) {
        return reduce<Record<string, any>, Record<string, any>>(obj, (result, value, key) => {
            const newKey = fn(key);
            result[newKey] = deepMapKeys(value, fn);
            return result;
        }, {}) as T;
    }

    return obj;
};

export default deepMapKeys;
