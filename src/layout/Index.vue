<template>
  <div class="layout-container">
    <router-view v-slot="{ Component }">
      <keep-alive include="['Home']">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
</template>

<style lang="scss" scoped>
.layout-container {
  padding-top: $title_bar_height;
  height: calc(100% - $title_bar_height * 2);
}
</style>