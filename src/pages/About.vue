<script lang="ts">
export default {
  name: "About"
}
</script>

<template>
  <var-card
      ripple="ripple"
      title="风景"
      description="公园的树林也很美。在公园的小山上栽满了树木，梧桐树的叶子随着时间的流逝慢慢变黄，纷纷飘落；枫树的叶子却变红了，公园笼罩在片片红云中，也使秋天增添了一分热情。而柏树的叶子仍是那么青翠欲滴，令你陶醉极了。山上有一群孩子在快乐的嬉戏，不时传来阵阵欢笑声，瞧，他们玩得多起劲呀，给树林增添了活力。"
  >
    <template #image>
      <var-swipe class="swipe-container">
        <var-swipe-item>
          <img class="swipe-image" src="https://varlet-varletjs.vercel.app/cat.jpg">
        </var-swipe-item>
        <var-swipe-item>
          <img class="swipe-image" src="https://varlet-varletjs.vercel.app/cat2.jpg">
        </var-swipe-item>
        <var-swipe-item>
          <img class="swipe-image" src="https://varlet-varletjs.vercel.app/cat3.jpg">
        </var-swipe-item>
      </var-swipe>
    </template>
  </var-card>
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
</style>