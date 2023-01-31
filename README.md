## vue-use-sync-url

[测试地址](https://linxianxi.github.io/vue-use-sync-url/)

## Introduce

在后台的列表页中，经常需要保存筛选条件和当前页码等数据，并在页面刷新、从详情页返回列表页时，保持之前的筛选条件。此库可以帮助你将筛选值同步到 url 参数，并在页面第一次加载时或浏览器前进后退时将 url 的值同步到你的筛选控件中。

## Install

```shell
npm install vue-use-sync-url

OR

yarn add vue-use-sync-url
```

## Usage

### url 参数的基础知识

在页面第一次加载、执行浏览器前进回退操作时，需要将 url 参数的值转换到当前页面的组件中，在这里我们称其为 `decode`。在页面中筛选结束点击提交或切换页码时，需要将这些值转换成参数并设置到 url 的参数上，在这里我们称其为 `encode`。

假设 url 上的参数为 `?a=1&a=2&b=true`，来看看获取参数的方法

```js
const searchParams = new URLSearchParams(window.location.search);

// ["1", "2"]
searchParams.getAll("a");

// "1"
searchParams.get(a);

// ["true"]
searchParams.getAll(b);

// "true"
searchParams.get(b);
```

从上面的结果可以得知，无论什么值最后都会被解析成 `string` 类型， 如果存在两个名字相同的 key，则会被解析为 `string[]`。 所以从 url 参数获取到的类型只为 `string ｜ string[]`。

### 如何使用

这里使用 `element-plus` 的组件做例子

```vue
<script setup>
import { reactive, onMounted } from "vue";
import useSyncUrl from "vue-use-sync-url";
import isDate from "lodash/isDate";

// 筛选控件的组件值
const values = reactive({
  keywords: "",
  status: undefined,
  enable: undefined,  // boolean 类型
  date: "",
});

const booleanValues = {
  true: true,
  false: false,
};

const { searchParams, syncToUrl } = useSyncUrl({
    configs: [
        {
          key: "keywords",
          omitEmptyString: true,
        },
        {
          key: "status"
        },
        {
          key: "enable",
          decode: (value) => {
            const result = booleanValues[values];
            return result === undefined ? null : result
          },
        },
        {
          // 根据 element-plus 日期组件值的格式来处理 encode 和 decode 逻辑
          key: "date",
          encode: (value) => (value ? new Date(value).toISOString() : {}),
          decode: (value) => (isDate(new Date(value)) ? value : {}),
        }
    ],
    onDecode: (params, isPopstate) => {
        Object.key(params).forEach(key => {
            values[key] = params[key]
        });

        // 在这里获取数据

        //  由浏览器前进回退触发
        if(isPopstate) {

        }
    },
});

const handleSearch = () => {
    syncToUrl(values);
     // 存储到 storage，使用 router.push(`/example1${localStorage.getItem("search")}`)
    localStorage.setItem("search", window.location.search);
    // 或存储 searchParams router.push({ path: "/example1", query: JSON.parse(localStorage.getItem("search")) })
    localStorage.setItem("search", JSON.stringify(searchParams));
}
</script>

<template>
  <el-input v-model="values.keywords" />
  <el-select v-model="values.status">
    <el-option value="success" label="success" />
    <el-option value="failed" label="failed" />
  </el-select>
  <el-select v-model="values.enable">
    <el-option :value="true" label="true" />
    <el-option :value="false" label="false" />
  </el-select>
  <el-date-picker v-model="values.date" />
  <el-button @click="handleSearch">search</el-button>
</template>
```

也可以使用 [encodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 和 [decodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURIComponent) 编码复杂的数据结构

```js
const values = reactive({
  obj: { a: { b: { c: 1 } } },
});

const { syncToUrl } = useSyncUrl({
  configs: [
    {
      key: "obj",
      encode: (value) => encodeURIComponent(JSON.stringify(value)),
      decode: (value) => JSON.parse(decodeURIComponent(value)),
    },
  ],
});
```

**configs**

配置需要进行 url 同步的 key 值，key 值与组件 `values` 的 key 值相对应。在你需要进行同步的时候将所有组件值传入 `syncToUrl` 并执行。

**key**

同步到 url 上的 key 值，执行 `syncToUrl` 时必须传入包含此 key 的值。

**decode**

自定义将 url 参数转换成组件值的方法。第一个参数的值为 url 上 key 的值。如果设置了 [decodeKeys](#decodeKeys)，则第一个参数为其对象值。

**encode**

自定义将组件值转成 url 参数的方法。例子中判断 `date` 的值是否为 `null` 来处理结果。如果返回空对象 `{}` 则会被忽略，不会同步到 url。每个选项返回的值最后会被收集到 [onDecode](#onDecode) 中的第一个参数中。

```js
// 转换成 test=1
{
  key: "test",
  encode: () => {
    return "1"
  }
}

// 转换成 a=1&b=2
{
  key: "test",
  encode: () => {
    return {
      a: "1",
      b: "2",
    }
  }
}

// 转换成 a=1&b=2&b=3
{
  key: "test",
  encode: () => {
    return {
      a: "1",
      b: ["2", "3"],
    }
  }
}

// 忽略
{
  key: "test",
  encode: () => {
    return {}
  }
}
```

<span id="decodeKeys">**decodeKeys**</span>

若 `encode` 返回的是对象，需要设置 `decodeKeys` 为返回对象的 key 值数组。这样 `decode` 的第一个参数才会解析成返回对象，否为会返回设置的 key 的值。

```js
{
  key: "test",
  decodeKeys: ["a", "b"],
  encode: (value: string[]) => ({
    a: value[0],
    b: value[1],
  }),
  decode: (value) => {
    // value 为 url 参数中 decodeKeys 的对象值 { a: "1", b: "2" }，如果 url 参数中 没有则为空对象 {}
    ...
  }
}
```

**omitEmptyString**

执行 `syncToUrl` 时，值为空字符串 `""` 时是否忽略，如果设置了 `encode` 则无效，`encode` 优先级高。默认为 `true`。

**omitUndefined**

执行 `syncToUrl` 时，值为 `null` 时是否忽略，如果设置了 `encode` 则无效，`encode` 优先级高。默认为 `true`。

**omitNull**

执行 `syncToUrl` 时，值为 `null` 时是否忽略，如果设置了 `encode` 则无效，`encode` 优先级高。默认为 `true`。

<span id="onDecode">**onDecode** (params: Record<string, any>, isPopState: boolean) => void</span>

页面第一次加载或浏览器前进回退时会触发的函数，`params` 为各个配置项 decode 返回的值的集合，`isPopState` 判断是否由浏览器前进回退触发，为 `false` 则为页面第一次加载触发，加载触发时在 `onMounted` 之前执行。

##

## Type Declarations

```ts
type EncodeResult = string | number | boolean | (string | number | boolean)[];

interface useSyncUrlConfig {
  key: string;
  decodeKeys?: string[];
  /**
   * @default true
   */
  omitEmptyString?: boolean;
  /**
   * @default true
   */
  omitUndefined?: boolean;
  /**
   * @default true
   */
  omitNull?: boolean;
  decode?: (value: any) => any;
  encode?: (value: any) => EncodeResult | Record<string, EncodeResult>;
}

interface useSyncUrlOptions {
  /**
   * @default "history"
   */
  mode?: "history" | "hash";
  configs: useSyncUrlConfig[];
  onDecode: (params: Record<string, any>, isPopState: boolean) => void;
}
```
