<template>
  <q-page>
    <!-- NEW -->
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Select a Participant</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item
              v-for="(participant, index) in participants"
              :key="index"
              clickable
              v-ripple
              @click="selectParticipant(participant)"
            >
              <q-item-section>{{ participant }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Enter Your Name</div>
          <q-input v-model="userName" label="Name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" @click="isDialogOpen = false" />
          <q-btn flat label="Submit" @click="selectParticipant(userName)" />
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

const userStore = UserStore.useStore();

const isDialogOpen = ref(true);
const userName = ref("");

const eventDetails = ref(null);
const userResponses = ref({});

const user = ref(null);

const participants = ref([]);

participants.value = ["Alice", "Bob", "Charlie"];

function selectParticipant(participant) {
  console.log("Selected participant:", participant);
  if (participant) {
    user.value = participant;
    userStore.update(participant);
  }
  // Handle participant selection logic here
  isDialogOpen.value = false;
}

//API Call to get Appointment by id
const API_GET_APP = "http://localhost:8080/public/opt/getParti/";

// async function fetchParticipants(appointmentId) {
//   let fullURL = API_GET_APP + appointmentId;
//   try {
//     const response = await fetch(fullURL);
//     if (!response.ok) {
//       throw new Error("Failed to fetch participants");
//     }
//     const participantsStr = await response.text();
//     participants.value = participantsStr.split(",");
//   } catch (error) {
//     console.error("Error fetching participants:", error);
//   }
// }

const fetchParticipants = async (appointmentId) => {
  let fullURL = API_GET_APP + appointmentId;
  try {
    const response = await fetch(fullURL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }
    // const responseData = await response.json();
    const participantsStr = await response.text();
    participants.value = participantsStr.split(",");
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Submit User Response
function submitResponse() {
  // Implement submission logic here...
  isDialogOpen.value = false;
}

// Open Dialog for User Name Input
function openDialog() {
  isDialogOpen.value = true;
}

/**
 * /api/opt/edit/{id}
 * /api/opt/getOpt{id}
 * /api/opt/getApp{id}
 * /api/opt/getParti{id}
 */

//API to Edit the participants on an appointmentOption
const API_EDIT_APPOPT = "http://localhost:8080/api/opt/edit";
// Example of a method to edit an appointment
const editAppointment = async (appointmentOption) => {
  try {
    const response = await fetch(API_EDIT_APPOPT, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // Include other headers as required, such as Authorization header for JWT
      },
      body: JSON.stringify(appointmentOption),
    });

    if (!response.ok) {
      // If the response status is 403, it means the deadline has passed
      if (response.status === 403) {
        alert("The deadline for editing this appointment has passed.");
      } else {
        // Handle other errors
        console.error("Error editing appointment:", response.statusText);
      }
    } else {
      // Handle successful edit
      console.log("Appointment edited successfully");
    }
  } catch (error) {
    console.error("Error editing appointment:", error);
  }
};

onMounted(async () => {
  const appointmentId = route.params.appointmentId;
  await fetchParticipants(appointmentId);
});
</script>
