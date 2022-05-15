<script setup lang="ts">
import { ref, watch } from "vue";
import { Snackbar } from "@varlet/ui";
import { useRouter, useRoute } from "vue-router";

import { useWindowSize } from '@vant/use';

const onSend = () => {
  router.push("/send");
  /*sendMsg({
    data: {
      title: "new",
      subtitle: "string",
      description: "string",
      imagesrc: [
        "https://varlet-varletjs.vercel.app/cat.jpg",
        "https://varlet-varletjs.vercel.app/cat2.jpg",
        "https://varlet-varletjs.vercel.app/cat3.jpg",
      ],
    },
  });*/
};
const router = useRouter();
function onHome() {
  router.replace("/");
}
const onSearch = () => {
  Snackbar.error("问就是没做好");
};
function onNotice() {
  router.replace("/notice");
}
function onAbout() {
  router.replace("/about");
}

function goBack() {
  router.go(-1);
}

const themeVars = {
  navBarHeight: "52px",
  navBarArrowSize: "25px",
  navBarTitleFontSize: "18px",
};

const docmHeight = document.documentElement.clientHeight;
const footerShow = ref(true)
const { width, height } = useWindowSize();
watch([height], () => {
  if (height.value < docmHeight) {
    footerShow.value = false
  } else {
    footerShow.value = true
  }
})
</script>

<template>
  <van-config-provider :theme-vars="themeVars">
    <van-nav-bar
      title="留言墙"
      left-arrow
      safe-area-inset-top
      @click-left="goBack"
    >
      <template #right>
        <van-icon name="search" size="23" />
      </template>
    </van-nav-bar>
  </van-config-provider>
  
  <div class="container">
    <router-view></router-view>
  </div>

  <var-bottom-navigation
    v-show="footerShow"
    fixed
    safe-area
    @fab-click="onSend"
  >
    <template #fab>
      <var-icon name="plus" />
    </template>
    <var-bottom-navigation-item @click="onHome" label="主页" icon="home" />
    <var-bottom-navigation-item @click="onSearch" label="搜索" icon="magnify" />
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
