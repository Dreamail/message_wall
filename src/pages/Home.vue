<script lang="ts">
import { ref } from "vue";
import { ImagePreview } from "@varlet/ui";

const loading = ref(false);
const finished = ref(false);
const list = ref<Array<any>>([]);

var continuation = "";

const getMsg = () => {
  return fetch("/api/messages", {
    headers: {
      continuation: continuation,
    },
  }).then((res) => {
    continuation = res.headers.get("continuation") as string;
    return res;
  });
};

export default {
  name: "Home",
  data() {
    return {
      loading: loading,
      finished: finished,
      list: list,
      load: () => {
        setTimeout(() => {
          getMsg().then((resp) => {
            resp.json().then(
              (
                json: {
                  id: string;
                  data: {
                    title: string;
                    subtitle: string;
                    description: string;
                    imagesrc: string[];
                  };
                }[]
              ) => {
                json.forEach((element) => {
                  list.value.push(element.data);
                });

                loading.value = false;

                if (json.length != 4) {
                  finished.value = true;
                }
              }
            );
          });
        }, 1000);
      },
      preview: (images: string[]) => {
        ImagePreview({
          images: images,
          closeable: true,
          zoom: 2.3,
        });
      },
    };
  },
};
</script>

<template>
  <var-list :finished="finished" v-model:loading="loading" @load="load">
    <div :key="item" v-for="item in list" class="card">
      <var-card
        @click="preview(item.imagesrc)"
        ripple="ripple"
        :title="item.title"
        :subtitle="item.subtitle"
        :description="item.description"
      >
        <template #image>
          <var-swipe class="swipe-container">
            <var-swipe-item v-for="imgsrc in item.imagesrc" :key="imgsrc">
              <img class="swipe-image" :src="imgsrc" />
            </var-swipe-item>
          </var-swipe>
        </template>
      </var-card>
    </div>
  </var-list>
</template>

<style scoped>
.swipe-container {
  height: 200px;
}
.swipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}
.card {
  padding: 8px;
}
</style>
