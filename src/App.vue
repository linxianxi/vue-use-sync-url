<script setup lang="ts">
import { router } from "./main.js";

const menus = [
  { path: "/example1", label: "example1" },
  { path: "/example2", label: "example2" },
  { path: "/example3", label: "example3" },
];
const defaultActive = window.location.pathname;
const onSelect = (index: string) => {
  router.push(menus.find((i) => i.path === index)?.path as string);
};
</script>

<template>
  <div class="layout">
    <el-menu class="menu" :default-active="defaultActive" @select="onSelect">
      <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">{{
        menu.label
      }}</el-menu-item>
    </el-menu>
    <div style="padding: 20px">
      <router-view />
    </div>
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.layout {
  display: flex;
  height: 100%;
}

.menu {
  height: 100%;
  width: 200px;
  min-width: 200px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
