<template>
  <q-page padding>
    <div class="q-pa-md" v-if="appointment">
      <h4>Edit Appointment</h4>
      <q-form @submit.prevent="saveChanges">
        <q-input filled v-model="appointment.bez" label="Bezeichnung" />

        <q-input filled v-model="appointment.ort" label="Ort" />

        <q-select
          outlined
          label="Teilnehmer"
          v-model="participantList"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add"
        />

        <q-input
          type="textarea"
          v-model="appointment.beschreibung"
          label="Beschreibung"
        />

        <!-- NEW -->
        <div class="q-pa-md deadline-input-container">
          <q-input filled v-model="appointment.deadline" class="deadline-input">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="appointment.deadline"
                    mask="YYYY-MM-DD HH:mm"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Save" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="appointment.deadline"
                    mask="YYYY-MM-DD HH:mm"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Save" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <!-- NEW -->
        <div class="row justify-center q-mt-md">
          <q-btn label="Update" type="submit" color="primary" />
          <q-btn label="Cancel" color="negative" @click="cancel" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import UserStore from "src/stores/user";
import AuthStore from "src/stores/authStore";

const router = useRouter();
const route = useRoute();

//Stores
const authStore = AuthStore.useStore();
const userStore = UserStore.useStore();

const appointmentId = route.params.appointmentId;
const appointment = ref(null);

//Formatting stuff
const participantList = ref([]);

//Authentication stuff
const jwtToken = authStore.token; //JWT Token (if exists)
// Create the authorization header
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  "Content-Type": "application/json",
  Accept: "application/json", // You can include other headers as needed
};

const fetchAppointment = async () => {
  const appointmentId = route.params.appointmentId;
  const API_GET_APP =
    "http://localhost:8080/api/app/getAppById/" + appointmentId;
  // Fetch appointment details from backend and populate appointmentData
  try {
    const response = await fetch(API_GET_APP, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }
    const responseData = await response.json();

    if (responseData) {
      appointment.value = responseData;
      console.log("TESTDATE " + appointment.value.deadline);
    }

    console.log(JSON.stringify(appointment.value));
  } catch (error) {
    console.error("Error fetching appointment:", error);
  }
};

const saveChanges = async () => {
  appointment.value.teilnehmer = participantList.value.join(",");

  const API_SAVE_APP = "http://localhost:8080/api/app/saveApp";
  // Submit updated appointment data to the backend
  try {
    const response = await fetch(API_SAVE_APP, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(appointment.value),
    });
    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }
    console.log("Appointment updated successfully!");
    router.push({ name: "overviewPage" });
  } catch (error) {
    console.error("Error updating appointment:", error);
  }
};

const cancel = () => {
  router.push({ name: "overviewPage" });
};

onMounted(() => {
  fetchAppointment();

  watch(
    () => appointment.value,
    (newVal) => {
      if (newVal && newVal.teilnehmer) {
        participantList.value = newVal.teilnehmer.split(",");
      }
    },
    { immediate: true }
  );
});
</script>

<style>
.page-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  padding: 20px;
}

.event-details {
  background-color: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.event-details h2 {
  color: #333333;
  margin-bottom: 10px;
}

.event-details p {
  color: #555555;
  margin-bottom: 10px;
}

.added-dates-table {
  margin-top: 20px;
}

.added-dates-table th,
.added-dates-table td {
  padding: 10px;
  border: 1px solid #eeeeee;
}

.added-dates-table th {
  background-color: #f9f9f9;
}

.q-btn {
  margin-top: 10px;
}

.q-btn:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Responsive adjustments */
@media screen and (max-width: 480px) {
  .page-container {
    grid-template-columns: 1fr;
  }

  .event-details,
  .added-dates-table table {
    font-size: 14px;
  }
}

@media screen and (max-width: 360px) {
  .event-details,
  .added-dates-table table {
    font-size: 12px;
  }
}
</style>
