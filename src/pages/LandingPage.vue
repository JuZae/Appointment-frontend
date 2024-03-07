<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <div class="q-pa-md">
        <h1>Welcome to A-Point!</h1>
        <p class="q-my-md">Manage your appointments with ease.</p>
      </div>
      <div class="q-pa-md">
        <q-btn
          label="View Overview"
          size="lg"
          class="q-ma-md"
          @click="navigateToOverview"
        />
        <q-btn
          label="Add New Event"
          size="lg"
          class="q-ma-md"
          @click="navigateToAddEvent"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const navigateToOverview = () => {
  router.push({ name: "overviewPage" });
};

const navigateToAddEvent = () => {
  router.push({ name: "addEvent" });
};
</script>

<style scoped>
h1 {
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

p {
  font-size: 1.2em;
  color: #666;
}

.q-btn {
  width: 200px;
}

body {
  background-color: #f5f5f5;
  font-family: "Arial", sans-serif;
}

h1 {
  color: #333;
}

.q-btn {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.q-btn:hover {
  transform: translateY(-2px);
}
</style>
