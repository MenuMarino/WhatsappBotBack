import { isPlainObject } from 'is-plain-object';
import unset from 'unset-value';

export const omit = (value: any, keys: any) => {
  if (typeof value === 'undefined') {
    return {};
  }

  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      value[i] = omit(value[i], keys);
    }
    return value;
  }

  if (!isPlainObject(value)) {
    return value;
  }

  if (typeof keys === 'string') {
    // eslint-disable-next-line no-param-reassign
    keys = keys.split(' ');
  }

  if (!Array.isArray(keys)) {
    return value;
  }

  for (let j = 0; j < keys.length; j++) {
    unset(value, keys[j]);
  }

  for (const key in value) {
    // eslint-disable-next-line no-prototype-builtins
    if (value.hasOwnProperty(key)) {
      value[key] = omit(value[key], keys);
    }
  }

  return value;
};
