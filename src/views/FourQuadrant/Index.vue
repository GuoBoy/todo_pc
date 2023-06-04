<template>
  <div class="main-quadrant">
    <Quadrant :quadrant_type="2" color="#3498db"></Quadrant>
    <Quadrant :quadrant_type="1" color="#2ecc71"></Quadrant>
    <Quadrant :quadrant_type="3" color="#16a085"></Quadrant>
    <Quadrant :quadrant_type="4" color="#2980b9"></Quadrant>
  </div>
</template>

<script lang="ts" setup>
import Quadrant from "./Quadrant.vue";

</script>

<style lang="scss" scoped>
.main-quadrant {
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}
</style>