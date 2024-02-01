<template>
  <router-view />
</template>

<script>
import { defineComponent, provide } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    provide("BACKEND_BASE_URL", "http://49.13.170.189:8080/");
  },
});
</script>
