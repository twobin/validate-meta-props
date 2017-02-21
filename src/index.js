'use strict';

// string
// array
// number
// func
// func({value: string, data: array}) // 指定函数回调格式
// bool
// object
// oneOfString(['detail', 'summary'])
// oneOfNumber([10, 100])
// oneOfType([string, array, number])
// arrayOf(number) // number, string, bool
// shape({ value: number, text: string }) // 输入的格式
// urls // 预定义的一种类型，专门用于配置取数 url

const META_PROPS_TYPE = [
  'string', 'number', 'array', 'object', 'bool', 'func',
  'urls', 'any', 'arrayOf', 'oneOfString', 'oneOfNumber',
  'oneOfType', 'shape'
];

function errMessage(str, callback) {
  callback ? callback() : console.warn('Error: ' + str);
};

function warnMessage(str, callback) {
  callback ? callback() : console.warn('Warn: ' + str);
};

function getTrimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
};

function isString(value) {
  return Object.prototype.toString.call(value) === '[object String]';
};

function isFunction(value) {
  return typeof value === 'function';
};

function isNumber(value) {
  return typeof value === 'number';
};

function isObject(value) {
  return typeof value === 'object' && value !== null;
};

function isUndefined(value) {
  return value === void 0;
};

function isNull(value) {
  return value === null;
};

function isEmpty(value) {
  return isUndefined(value) || isNull(value);
};

function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};

function isBool(value) {
  return typeof value === 'boolean';
};

function isShape(value, type) {
  let flag = true;

  if (type.indexOf('shape') !== -1 && type.indexOf('{') && type.indexOf('}')) {
    const indexFirst = type.indexOf('{') + 1;
    const indexLast = type.indexOf('}');

    const data = type.slice(indexFirst, indexLast).split(',').map((entry) => {
      let temp = entry ? entry.split(':') : null;

      if (temp && temp[0] && temp[1]) {
        const trimStr = [];
        trimStr.push(getTrimStr(temp[0]));
        trimStr.push(getTrimStr(temp[1]));

        if (trimStr[0] && trimStr[1]) {
          if (typeof value[trimStr[0]] === trimStr[1]) {
            return true;
          }
          flag = false;
        }

        flag = false;
      }

      flag = false;

      return false;
    });

    return flag;
  }

  return false;
};

function isOneOf(value, type) {
  if (type.indexOf('oneOf') !== -1 && type.indexOf('[') && type.indexOf(']')) {
    const indexFirst = type.indexOf('[') + 1;
    const indexLast = type.indexOf(']');

    const data = type.slice(indexFirst, indexLast).split(',').map((entry) => {
      let temp = getTrimStr(entry);

      if (type.indexOf('oneOfNumber') !== -1) {
        temp = Number(temp);
      }

      return temp;
    });

    if (data) {
      if (type.indexOf('oneOfType') !== -1) {
        for (let i = 0, len = data.length; i < len; i++) {
          if (META_PROPS_TYPE.indexOf(data[i]) === -1) {
            return false;
          }
        }
        return true;
      }

      if (data.indexOf(value) !== -1) {
        return true;
      }
    }

    return false;
  }

  return false;
};

function isArrayOf(value, type) {
  if (isArray(value)) {
    if (type === 'arrayOf(number)') {
      for (let i = 0, len = value.length; i < len; i++) {
        if (!isNumber(value[i])) {
          return false;
        }
      }

      return true;
    }

    if (type === 'arrayOf(string)') {
      for (let i = 0, len = value.length; i < len; i++) {
        if (!isString(value[i])) {
          return false;
        }
      }

      return true;
    }

    if (type === 'arrayOf(bool)') {
      for (let i = 0, len = value.length; i < len; i++) {
        if (!isBool(value[i])) {
          return false;
        }
      }

      return true;
    }
  }

  return false;
};

function validateProps(value, type) {
  if (type) {
    if (type === 'string') {
      if (isString(value)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 string 类型！' };
    }

    if (type === 'number') {
      if (isNumber(value)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 number 类型！' };
    }

    if (type === 'array') {
      if (isArray(value)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 array 类型！' };
    }

    if (type === 'object') {
      if (isObject(value)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 object 类型！' };
    }

    if (type === 'bool') {
      if (isBool(value)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 bool 类型！' };
    }

    if (type === 'urls') {
    }

    if (type === 'any') {
      return { valid: true };
    }

    if (type === 'func') {
      if (isFunction(value)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 function 类型！' };
    }

    // const funcName = 'func(';
    // if (type.indexOf(funcName) !== -1) {
    // }

    if (type.indexOf('arrayOf') !== -1) {
      if (isArrayOf(value, type)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 arrayOf 为 number, string, bool 类型其一！' };
    }

    if (type.indexOf('oneOfNumber') !== -1) {
      if (isOneOf(value, type)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 oneOfNumber 为 number 类型！' };
    }

    if (type.indexOf('oneOfString') !== -1) {
      if (isOneOf(value, type)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 oneOfString 为 string 类型！' };
    }

    if (type.indexOf('oneOfType') !== -1) {
      if (isOneOf(value, type)) {
        return { valid: true };
      }

      return { valid: false, error: '要求 oneOfType 类型！' };
    }

    if (type.indexOf('shape') !== -1) {
      if (isShape(value, type)) {
        return { valid: true };
      }

      return { valid: false, error: '要求符合 shape 格式！' };
    }
  }

  return { valid: false, error: 'type 不存在！' };
};

export default validateProps;
