<template>
  <p>将值拆分成两个不同名称的键值对存储</p>
  <div class="controls">
    <el-date-picker v-model="values.rangeDate" type="daterange" />
    <el-button @click="onSubmit">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import useSyncUrl from "../../lib";

const values = reactive({
  rangeDate: "",
});

const { syncToUrl } = useSyncUrl({
  configs: [
    {
      key: "rangeDate",
      decodeKeys: ["startDate", "endDate"],
      encode: (value: Date[]) => {
        return {
          startDate: value[0].toISOString(),
          endDate: value[1].toISOString(),
        };
      },
      decode: (value) => {
        return {
          rangeDate: [value.startDate, value.endDate],
        };
      },
    },
  ],
  onDecode: (params, isPopState) => {
    // 首次加载，将 url 上的值赋到组件中
    Object.keys(params).forEach((key) => {
      (values as any)[key] = params[key];
    });
  },
});

const onSubmit = () => {
  syncToUrl(values);
};
</script>
