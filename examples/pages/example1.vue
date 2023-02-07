<template>
  <p>基本使用</p>
  <div class="controls">
    <el-input
      v-model="values.keywords"
      placeholder="关键字"
      style="width: 200px"
    />
    <el-select v-model="values.status" placeholder="字符串 select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="values.enable" placeholder="boolean select">
      <el-option :value="true" label="true" />
      <el-option :value="false" label="false" />
    </el-select>
    <el-date-picker v-model="values.date" />
    <el-date-picker v-model="values.rangeDate" type="daterange" />
  </div>
  <el-button style="margin-top: 10px" type="primary" @click="onSubmit"
    >搜索</el-button
  >
  <p>数据1</p>
  <p>数据2</p>
  <p>数据3</p>
  <p>数据4</p>
  <p>数据5</p>
  <el-pagination
    v-model:current-page="values.page"
    background
    layout="prev, pager, next"
    :total="50"
    @current-change="onPageChange"
  />
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import useSyncUrl, { toBoolean } from "../../lib";

// 各个控件的值
const values = reactive({
  page: 1,
  keywords: "",
  status: "",
  enable: "",
  date: "",
  rangeDate: "",
});

const syncToUrl = useSyncUrl({
  configs: [
    {
      name: "keywords",
      decode: (value) => {
        values.keywords = value as string;
      },
      encode: () => values.keywords,
    },
    {
      name: "status",
      decode: (value) => {
        values.status = value as string;
      },
      encode: () => values.status,
    },
    {
      name: "enable",
      decode: (value) => {
        values.enable = toBoolean(value as string);
      },
      encode: () => values.enable,
    },
    {
      name: "date",
      encode: () => (values.date ? new Date(values.date).toISOString() : {}),
      decode: (value) => {
        values.date = value as string;
      },
    },
    {
      name: "page",
      decode: (value) => {
        values.page = Number(value);
      },
      encode: () => values.page,
    },
    {
      name: "rangeDate",
      encode: () =>
        values.rangeDate
          ? [
              new Date(values.rangeDate[0]).toISOString(),
              new Date(values.rangeDate[0]).toISOString(),
            ]
          : {},
      decode: (value) => {
        if (Array.isArray(value)) {
          values.rangeDate = value as any;
        } else {
          values.rangeDate = "";
        }
      },
    },
  ],
  onDecodeSuccess: (isPopstate) => {
    console.log("onDecodeSuccess", "isPopstate:", isPopstate);
  },
});

// 切换页码
const onPageChange = () => {
  syncToUrl();
};

// 点击搜索按钮
const onSubmit = () => {
  syncToUrl();
};

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
</script>
