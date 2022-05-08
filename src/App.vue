<script setup lang="ts">
import { ref } from "vue";
import { Snackbar } from "@varlet/ui";
import { useRouter, useRoute } from "vue-router";

const active = ref(0);
const handleClick = () => {
  Snackbar.error("问就是没做好");
};
const router = useRouter();
function onHome() {
  router.replace("/");
}
function onNotice() {
  router.replace("/notice");
}
function onAbout() {
  router.replace("/about");
}

function goBack() {
  router.go(-1);
}
</script>

<template>
  <var-app-bar title="留言墙">
    <template #left>
      <var-button
        round
        text
        color="transparent"
        text-color="#fff"
        @click="goBack"
      >
        <var-icon name="chevron-left" :size="24" />
      </var-button>
    </template>
  </var-app-bar>

  <div class="container">
    <router-view></router-view>
  </div>

  <var-bottom-navigation
    v-model:active="active"
    fixed="fixed"
    safe-area="safe-area"
    @fab-click="handleClick"
  >
    <template #fab>
      <var-icon name="plus" />
    </template>
    <var-bottom-navigation-item @click="onHome" label="主页" icon="home" />
    <var-bottom-navigation-item
      @click="handleClick"
      label="搜索"
      icon="magnify"
    />
    <var-bottom-navigation-item
      @click="onNotice"
      label="公告"
      icon="message-text-outline"
    />
    <var-bottom-navigation-item
      @click="onAbout"
      label="关于"
      icon="information"
    />
  </var-bottom-navigation>
</template>

<style>
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/

.container {
  padding-top: 10px;
  padding-bottom: 50px;
}
</style>
