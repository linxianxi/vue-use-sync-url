<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const menus = [
  { path: "/base", label: "base" },
  { path: "/other", label: "other" },
];

const activePath = computed(() => {
  return route.path;
});
</script>

<template>
  <div class="layout">
    <el-menu class="menu" :router="true" :default-active="activePath">
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
