<template>
  <router-view />
</template>

<script>
import { defineComponent, provide } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    provide("BACKEND_BASE_URL", "http://apoint-backend2:8080/");
  },
});
</script>
