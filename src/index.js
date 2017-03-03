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
// oneOfType([string, number])
// oneOfType([array, object])
// arrayOf(number) // number, string, bool
// shape({ value: number, text: string }) // 输入的格式
// urls // 预定义的一种类型，专门用于配置取数 url

const META_PROPS_TYPE = [
  'string', 'number', 'array', 'object', 'bool', 'func',
  'urls', 'any', 'arrayOf', 'oneOfString', 'oneOfNumber',
  'oneOfType', 'shape'
];
const META_ONEOF_TYPE = ['string', 'number', 'array', 'object'];

function errMessage(str, callback) {
  callback ? callback() : console.warn('Error: ' + str);
};

function warnMessage(str, callback) {
  callback ? callback() : console.warn('Warn: ' + str);
};

function getTrimStr(str) {
  return str.replace(/(^\s*)|(\s*$)/g, '');
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

function isString(value) {
  if (Object.prototype.toString.call(value) === '[object String]') {
    return { code: true };
  }

  return { code: false, error: '要求 string 类型！' };
};

function isNumber(value) {
  if (typeof value === 'number') {
    return { code: true };
  }

  return { code: false, error: '要求 number 类型！' };
};

function isBool(value) {
  if (typeof value === 'boolean') {
    return { code: true };
  }

  return { code: false, error: '要求 bool 类型！' };
};

function isFunction(value) {
  if (typeof value === 'function') {
    return { code: true };
  }

  return { code: false, error: '要求 function 类型！' };
};

function isObject(value) {
  if (typeof value === 'object' && value !== null) {
    return { code: true };
  }

  return { code: false, error: '要求 object 类型！' };
};

function isArray(value) {
  if (Object.prototype.toString.call(value) === '[object Array]') {
    return { code: true };
  }

  return { code: false, error: '要求 array 类型！' };
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
        }
      }

      flag = false;

      return false;
    });

    if (flag) {
      return { code: flag };
    }

    return { code: flag, error: '要求符合 shape 格式！' };
  }

  return { code: false, error: '要求符合 shape 格式！' };
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
      // oneOfType([string, number]) || oneOfType([array, object])
      if (type.indexOf('oneOfType') !== -1) {
        for (let i = 0, len = data.length; i < len; i++) {
          if (META_ONEOF_TYPE.indexOf(data[i]) === -1) {
            return { code: false, error: data[i] + '是未定义类型！oneOfType 仅支持以下类型：' + META_ONEOF_TYPE };
          }

          if (data[i] === 'number' || data[i] === 'string') {
            if (isNumber(value).code || isString(value).code) {
              return { code: true };
            } else {
              return { code: false, error: '要求 string 或 number 类型！' };
            }
          }

          if (data[i] === 'array' || data[i] === 'object') {
            if (isArray(value).code || isObject(value).code) {
              return { code: true };
            } else {
              return { code: false, error: '要求 array 或 object 类型！' };
            }
          }
        }
        return { code: false, error: 'oneOfType 仅支持以下类型：' + META_ONEOF_TYPE };
      }

      if (data.indexOf(value) !== -1) {
        return { code: true };
      } else {
        if (type.indexOf('oneOfNumber') !== -1) {
          return { code: false, error: '要求 oneOfNumber 为 number 类型！' };
        }
        if (type.indexOf('oneOfString') !== -1) {
          return { code: false, error: '要求 oneOfString 为 string 类型！' };
        }
      }
    }

    return { code: false, error: '数据格式错误！' };
  }

  return { code: false, error: '写法错误或数据格式错误！' };
};

function isArrayOf(value, type) {
  if (isArray(value)) {
    if (type === 'arrayOf(number)') {
      for (let i = 0, len = value.length; i < len; i++) {
        if (!isNumber(value[i])) {
          return { code: false, error: '要求 arrayOf 为 number 类型！' };
        }
      }

      return { code: true };
    }

    if (type === 'arrayOf(string)') {
      for (let i = 0, len = value.length; i < len; i++) {
        if (!isString(value[i])) {
          return { code: false, error: '要求 arrayOf 为 string 类型！' };
        }
      }

      return { code: true };
    }

    if (type === 'arrayOf(bool)') {
      for (let i = 0, len = value.length; i < len; i++) {
        if (!isBool(value[i])) {
          return { code: false, error: '要求 arrayOf 为 bool 类型！' };
        }
      }

      return { code: true };
    }
  }

  return { code: false, error: '要求 array 数据！' };
};

function validateProps(value, type) {
  if (type) {
    if (type === 'string') {
      if (isString(value).code) {
        return { valid: true };
      }

      return { valid: false, error: isString(value).error };
    }

    if (type === 'number') {
      if (isNumber(value).code) {
        return { valid: true };
      }

      return { valid: false, error: isNumber(value).error };
    }

    if (type === 'array') {
      if (isArray(value).code) {
        return { valid: true };
      }

      return { valid: false, error: isArray(value).error };
    }

    if (type === 'object') {
      if (isObject(value).code) {
        return { valid: true };
      }

      return { valid: false, error: isObject(value).error };
    }

    if (type === 'bool') {
      if (isBool(value).code) {
        return { valid: true };
      }

      return { valid: false, error: isBool(value).error };
    }

    if (type === 'urls') {
      return { valid: true };
    }

    if (type === 'any') {
      return { valid: true };
    }

    if (type === 'func') {
      if (isFunction(value).code) {
        return { valid: true };
      }

      return { valid: false, error: isFunction(value).error };
    }

    // const funcName = 'func(';
    // if (type.indexOf(funcName) !== -1) {
    // }

    if (type.indexOf('arrayOf') !== -1) {
      if (isArrayOf(value, type).code) {
        return { valid: true };
      }

      return { valid: false, error: isArrayOf(value, type).error };
    }

    if (type.indexOf('oneOfNumber') !== -1) {
      if (isOneOf(value, type).code) {
        return { valid: true };
      }

      return { valid: false, error: isOneOf(value, type).error };
    }

    if (type.indexOf('oneOfString') !== -1) {
      if (isOneOf(value, type).code) {
        return { valid: true };
      }

      return { valid: false, error: isOneOf(value, type).error };
    }

    if (type.indexOf('oneOfType') !== -1) {
      if (isOneOf(value, type).code) {
        return { valid: true };
      }

      return { valid: false, error: isOneOf(value, type).error };
    }

    if (type.indexOf('shape') !== -1) {
      if (isShape(value, type).code) {
        return { valid: true };
      }

      return { valid: false, error: isShape(value, type).error };
    }
  }

  return { valid: false, error: 'type 不存在！' };
};

function convertStringToArray(value, type) {
  const tempType = (type === 'string' || type === 'number') ? type : 'string';
  const firstSymbol = '[';
  const lastSymbol = ']';

  if (value && value.indexOf(firstSymbol) !== -1 && value.indexOf(lastSymbol) !== -1) {
    const indexFirst = value.indexOf(firstSymbol) + 1;
    const indexLast = value.indexOf(lastSymbol);

    const data = value.slice(indexFirst, indexLast).split(',').map((entry) => {
      let temp = getTrimStr(entry);

      if (tempType === 'number') {
        temp = Number(temp);
      }

      return temp;
    });

    if (data && isArray(data)) {
      return data;
    }

    return value;
  }

  return value;
};

function convertStringToObject(value) {
  const obj = {};
  const temp = value.split(',');

  const fields = temp.map(entry => {
    const str = getTrimStr(entry);
    return str.replace(/{|}+/g, '');
  });

  if (isArray(fields)) {
    fields.map(field => {
      const item = field.split(':');

      if (item[0] && item[1]) {
        const item0 = item[0].replace(/'|"|\+/g, '');

        if (!item[1].match(/'|"/g)) {
          obj[item0] = (!Number(item[1]) && Number(item[1]) !== 0) ? item[1] : Number(item[1]);
        } else {
          obj[item0] = item[1].replace(/'|"+/g, '');
        }
      }
      return true;
    });
    return isObject(obj) ? obj : value;
  }
  return value;
};

export default validateProps;
export {
  convertStringToArray, convertStringToObject,
};

