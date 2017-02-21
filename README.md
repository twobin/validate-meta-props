# validate-props

validate props

[![npm version](https://badge.fury.io/js/validate-props.png)](https://badge.fury.io/js/validate-props)
[![build status](https://travis-ci.org/twobin/validate-props.svg)](https://travis-ci.org/twobin/validate-props)
[![npm downloads](https://img.shields.io/npm/dt/validate-props.svg?style=flat-square)](https://www.npmjs.com/package/validate-props)

## usage

```
$ npm i -S validate-props
```

## docs

### validate-props

```
import validateProps from 'validate-props';

validateProps(value, type);
```

### type

- string

- number

- bool

- array

- object

- func

- func({value: string, data: array}) // 指定函数回调格式

- oneOfString(['detail', 'summary'])

- oneOfNumber([10, 100])

- oneOfType([string, array, number])

- arrayOf(number) // number, string, bool

- shape({ value: number, text: string }) // 输入的格式

- urls // 预定义的一种类型，专门用于配置取数 url
