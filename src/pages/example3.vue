<template>
  <p>存储复杂值到 url</p>
  <p>obj: {{ JSON.stringify(values.obj) }}</p>

  <el-button @click="setObj">设置 obj 为比较复杂的对象值</el-button>
  <el-button @click="onSubmit">搜索</el-button>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import useSyncUrl from "../../lib";

// 各个控件的值
const values = reactive<{ obj: any }>({
  obj: null,
});

const setObj = () => {
  values.obj = { a: { b: { c: true } } };
};

const { syncToUrl } = useSyncUrl({
  configs: [
    {
      key: "obj",
      encode: (value) => encodeURIComponent(JSON.stringify(value)),
      decode: (value) => JSON.parse(decodeURIComponent(value)),
    },
  ],
  onDecode: (params) => {
    console.log("params", params);
    Object.keys(params).forEach((key) => {
      (values as any)[key] = params[key];
    });
  },
});

const onSubmit = () => {
  syncToUrl(values);
};
</script>
