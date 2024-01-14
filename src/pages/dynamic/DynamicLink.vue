<template>
  <q-page>
    <!-- NEW -->
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">Enter Your Name</div>
          <q-input v-model="userName" label="Name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="isDialogOpen = false" />
          <q-btn flat label="Submit" @click="submitResponse" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Event Details and Date Options -->
    <div v-if="eventDetails">
      <h2>{{ eventDetails.title }}</h2>
      <p>{{ eventDetails.description }}</p>
      <!-- Display date options with toggle switches -->
      <div v-for="option in eventDetails.dateOptions" :key="option.id">
        <q-toggle v-model="userResponses[option.id]" :label="option.date" />
      </div>
      <q-btn label="Submit Response" @click="openDialog" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import UserStore from "src/stores/user";

const route = useRoute();
const isDialogOpen = ref(false);
const userName = ref("");
const eventDetails = ref(null);
const userResponses = ref({});

// Fetch Event Details
async function fetchEventDetails(appointmentId) {
  // Implement fetch logic here...
}

// Submit User Response
function submitResponse() {
  // Implement submission logic here...
  isDialogOpen.value = false;
}

// Open Dialog for User Name Input
function openDialog() {
  isDialogOpen.value = true;
}

onMounted(async () => {
  const appointmentId = route.params.appointmentId;
  await fetchEventDetails(appointmentId);
});
</script>
