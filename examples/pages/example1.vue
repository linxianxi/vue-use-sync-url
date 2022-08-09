<template>
  <p>基本使用</p>
  <div class="controls">
    <el-input v-model="values.keywords" placeholder="关键字" />
    <el-select v-model="values.select" placeholder="字符串 select">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select v-model="values.radio" placeholder="boolean select">
      <el-option :value="true" label="true" />
      <el-option :value="false" label="false" />
    </el-select>
    <el-date-picker v-model="values.date" />
    <el-date-picker v-model="values.rangeDate" type="daterange" />
    <el-button @click="onSubmit">搜索</el-button>
  </div>
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
import { onMounted, reactive } from "vue";
import useSyncUrl from "../../lib";
import isDate from "lodash/isDate";

// 各个控件的值
const values = reactive({
  page: 1,
  keywords: "",
  select: "",
  radio: undefined,
  date: "",
  rangeDate: "",
});

const booleanValues = {
  true: true,
  false: false,
};

const { searchParams, syncToUrl } = useSyncUrl({
  // mode: "hash",
  configs: [
    {
      key: "keywords",
    },
    {
      key: "select",
    },
    {
      key: "radio",
      decode: (value) => (booleanValues as any)[value],
    },
    {
      key: "date",
      encode: (value) => (value ? new Date(value).toISOString() : {}),
      decode: (value) => (isDate(new Date(value)) ? value : {}),
    },
    { key: "page", decode: Number },
    {
      key: "rangeDate",
      encode: (value) => {
        return value
          ? [new Date(value[0]).toISOString(), new Date(value[1]).toISOString()]
          : [];
      },
      decode: (value) => {
        // 使用者自定义逻辑
        if (
          Array.isArray(value) &&
          value.length > 1 &&
          isDate(new Date(value[0])) &&
          isDate(new Date(value[1])) &&
          new Date(value[0]).getTime() <= new Date(value[1]).getTime()
        ) {
          return [value[0], value[1]];
        }
        return {};
      },
    },
  ],
  onDecode: (params, isPopState) => {
    Object.keys(params).forEach((key) => {
      (values as any)[key] = params[key];
    });
    // 在这里请求数据
  },
});

// 切换页码
const onPageChange = () => {
  syncToUrl(values);
  // 在你想存储的地方执行
  localStorage.setItem("searchParams", JSON.stringify(searchParams));
};

// 点击按钮
const onSubmit = () => {
  syncToUrl(values);
  // 在你想存储的地方执行
  localStorage.setItem("searchParams", JSON.stringify(searchParams));
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
