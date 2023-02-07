<template>
  <p>将值拆分成两个不同名称的键值对存储，encode 无值时也需要返回对应的 key</p>
  <div class="controls">
    <el-date-picker v-model="rangeDate" type="daterange" />
    <el-button @click="onSubmit">提交</el-button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useSyncUrl from "../../lib";

const rangeDate = ref<string | [Date, Date]>("");

const syncToUrl = useSyncUrl({
  configs: [
    {
      name: "rangeDate",
      encode: () => {
        if (rangeDate.value) {
          return {
            startDate: new Date(rangeDate.value[0]).toISOString(),
            endDate: new Date(rangeDate.value[1]).toISOString(),
          };
        }
        // url 上清空
        return {
          startDate: undefined,
          endDate: undefined,
        };
      },
      decode: (value, allValues) => {
        if (allValues.startDate && allValues.endDate) {
          rangeDate.value = [
            new Date(allValues.startDate as string),
            new Date(allValues.endDate as string),
          ];
        } else {
          rangeDate.value = "";
        }
      },
    },
  ],
  onDecodeSuccess: (isPopstate) => {
    console.log("onDecodeSuccess", "isPopstate:", isPopstate);
  },
});

const onSubmit = () => {
  syncToUrl();
};
</script>
