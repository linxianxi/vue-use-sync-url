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

## API

## useSyncUrl

| 属性            | 描述                                                                                | 类型                            |
| --------------- | ----------------------------------------------------------------------------------- | ------------------------------- |
| configs         | 配置                                                                                | [SyncUrlConfig](#SyncUrlConfig) |
| onDecodeSuccess | 页面第一次加载或浏览器前进回退, decode 结束会触发的函数，参数为是否由前进回退触发。 | (isPopstate: boolean) => void   |

返回一个函数，可以传入在配置之外的值。例如 `syncToUrl({a: "1"})`

### SyncUrlConfig

| 属性            | 描述                                                                                                                           | 类型                                                                                                           | 默认值 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------ |
| name            | 显示在 url 上的名称                                                                                                            | string                                                                                                         | -      |
| encode          | 将值转换到 url 上的操作，不是 string 类型的会自动转换为 string 类型                                                            | () => string \| number \| boolean \| undefined \| null \| (string \| number \| boolean \| undefined \| null)[] | -      |
| decode          | 将 url 上的值转换到页面上的操作，第一个参数为对应 name 的值，第二个参数为当前 url 上所有的值，第三个参数表示是否由前进回退触发 | (value: string \| string[], allValues: Record<string, string \| string[]>, isPopstate: boolean) => void        | -      |
| omitEmptyString | encode 时，值为空字符串 `""` 时是否忽略                                                                                        | boolean                                                                                                        | true   |
| omitNull        | encode 时，值为 null 时是否忽略                                                                                                | boolean                                                                                                        | true   |
| omitUndefined   | encode 时，值为 undefined 时是否忽略                                                                                           | boolean                                                                                                        | true   |
| false           |

## Usage

### url 参数的基础知识

在页面第一次加载、执行浏览器前进回退操作时，需要将 url 参数的值转换到当前页面的组件中，在这里我们称其为 `decode`。在页面中筛选结束点击提交或切换页码时，需要将这些值转换成参数并设置到 url 的参数上，在这里我们称其为 `encode`。

假设 url 上的参数为 `?a=1&a=2&b=true`，来看看获取参数的方法

```js
const searchParams = new URL(location.href).searchParams;

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
import useSyncUrl, { toBoolean } from "vue-use-sync-url";

// 筛选控件的组件值
const values = reactive({
  keywords: "",
  status: "",
  enable: "",
});

const syncToUrl = useSyncUrl({
  configs: [
    {
      name: "keywords",
      decode: (value) => {
        values.keywords = value;
      },
      encode: () => values.keywords,
    },
    {
      name: "status",
      decode: (value) => {
        values.status = value;
      },
      encode: () => values.status,
    },
    {
      name: "enable",
      decode: (value) => {
        values.enable = toBoolean(value);
      },
      encode: () => values.enable,
    },
  ],
  onDecodeSuccess: (isPopstate) => {
    //get  data
    fetch(....)
  },
});

const handleSearch = () => {
  syncToUrl();
  // 你可以存储到 storage，比如在详情页使用 router.push(`/base${localStorage.getItem("search")}`)
  localStorage.setItem("search", location.search);
};
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
  <el-button @click="handleSearch">search</el-button>
</template>
```

**encode 例子**

自定义将组件值转成 url 参数的方法。如果返回空对象 `{}` 则会被忽略，不会同步到 url。

```js
// 转换成 name=1
{
  name: "name",
  encode: () => {
    return "1"
  }
}

// 转换成 name=undefined
{
  name: "name",
  omiUndefined: false,
  encode: () => {
    return undefined
  }
}

// 转换成 a=1&b=2
{
  name: "name",
  encode: () => {
    return {
      a: "1",
      b: "2",
    }
  }
}

// 转换成 a=1&b=2&b=3
{
  name: "name",
  encode: () => {
    return {
      a: "1",
      b: ["2", "3"],
    }
  }
}

// 忽略
{
  name: "name",
  encode: () => {
    return {}
  }
}

// 转换成 a=1
{
  name: "name",
  encode: () => {
    return {
      a: "1",
      b: undefined,
    }
  }
}

// 转换成 a=1&b=undefined
{
  name: "name",
  omitUndefined: false,
  encode: () => {
    return {
      a: "1",
      b: undefined,
    }
  }
}
```
