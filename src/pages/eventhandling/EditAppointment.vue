<template>
  <q-page padding>
    <div class="q-pa-md" v-if="appointment">
      <h4>Appointment bearbeiten</h4>
      <q-form @submit.prevent="saveChanges">
        <q-input
          filled
          v-model="appointment.bez"
          label="Bezeichnung"
          class="custom-q-input"
        />

        <q-input
          filled
          v-model="appointment.ort"
          label="Ort"
          class="custom-q-input"
        />

        <q-select
          filled
          outlined
          label="Teilnehmer"
          v-model="participantList"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add"
          class="custom-q-select"
        />

        <q-input
          type="textarea"
          v-model="appointment.beschreibung"
          label="Beschreibung"
          class="custom-q-input"
          filled
        />

        <!-- NEW -->
        <div class="deadline-input-container">
          <q-input filled v-model="appointment.deadline" class="custom-q-input">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer custom-q-icon">
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
                      <q-btn v-close-popup label="Save" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer custom-q-icon">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-time
                    v-model="appointment.deadline"
                    mask="YYYY-MM-DD HH:mm"
                    label="Deadline"
                    format24h
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Save" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="appointment-options">
          <h5>Appointment Options</h5>
          <div
            class="appointment-option"
            v-for="(option, index) in appointmentOptions"
            :key="index"
          >
            <!-- <div class="q-pa-md flex-row-align"> -->
            <div class="deadline-input-container">
              <q-input filled v-model="option.datum" class="custom-q-input">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer custom-q-icon">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="option.datum" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Save" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon
                    name="access_time"
                    class="cursor-pointer custom-q-icon"
                  >
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-time
                        v-model="option.datum"
                        mask="YYYY-MM-DD HH:mm"
                        format24h
                      >
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Save" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-btn
              class="q-btn-delete"
              icon="delete"
              @click="removeAppointmentOption(index)"
            />
            <!-- </div> -->
          </div>
          <q-btn label="Add Option" @click="addAppointmentOption" />
        </div>
        <!-- NEW -->
        <div class="row justify-center q-mt-md">
          <q-btn label="Speichern" type="submit" />
          <q-btn label="Abbrechen" @click="cancel" />
        </div>
      </q-form>
    </div>

    <!-- Success Dialog -->
    <q-dialog v-model="isSuccessDialogOpen">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="check" color="green" />
          <span class="q-ml-sm">Appointment updated successfully!</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" @click="closeSuccessDialog" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import AuthStore from "src/stores/authStore";

const router = useRouter();
const route = useRoute();

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

//Stores
const authStore = AuthStore.useStore();

const appointmentId = route.params.appointmentId;
const appointment = ref(null);

const appointmentOptions = ref([]);

//Formatting stuff
const participantList = ref([]);

//Dialog
const isSuccessDialogOpen = ref(false);

//Authentication stuff
const jwtToken = authStore.token; //JWT Token (if exists)
// Create the authorization header
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  "Content-Type": "application/json",
  Accept: "application/json", // You can include other headers as needed
};

const fetchAppointment = async (appointmentId) => {
  // const appointmentId = route.params.appointmentId;
  // const API_GET_APP =
  //   "http://localhost:8080/api/app/getAppById/" + appointmentId;
  const API_GET_APP = BACKEND_BASE_URL + "api/app/getAppById/" + appointmentId;
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

const fetchAppointmentOptions = async (appointmentId) => {
  // const appointmentId = route.params.appointmentId;
  // const API_GET_APP =
  //   "http://localhost:8080/public/opt/getOpt/" + appointmentId;
  const API_GET_APP = BACKEND_BASE_URL + "public/opt/getOpt/" + appointmentId;
  // Fetch appointment details from backend and populate appointmentData
  try {
    const response = await fetch(API_GET_APP, {
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
    const responseData = await response.json();

    if (responseData) {
      appointmentOptions.value = responseData;
      // console.log("OPtions oder so: " + JSON.stringify(responseData));
    }
  } catch (error) {
    console.error("Error fetching appointment:", error);
  }
};

const saveChanges = async () => {
  saveAppointment();
  // saveAppointmentOptions();
  isSuccessDialogOpen.value = true;
};

const saveAppointment = async () => {
  appointment.value.teilnehmer = participantList.value.join(",");

  // const API_SAVE_APP = "http://localhost:8080/api/app/saveApp";
  const API_SAVE_APP = BACKEND_BASE_URL + "api/app/saveApp";
  // const API_SAVE_OPT = "http://localhost:8080/api/app/saveAppOption";
  const API_SAVE_OPT = BACKEND_BASE_URL + "api/app/saveAppOption";
  // Submit updated appointment data to the backend
  try {
    const appResponse = await fetch(API_SAVE_APP, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(appointment.value),
    });
    if (!appResponse.ok) {
      throw new Error(
        `Request failed with status ${appResponse.status}: ${appResponse.statusText}`
      );
    }

    // Save each appointment option
    for (let option of appointmentOptions.value) {
      const optResponse = await fetch(API_SAVE_OPT, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(option),
      });
      if (!optResponse.ok)
        throw new Error(`Failed to save option: ${optResponse.statusText}`);
    }

    isSuccessDialogOpen.value = true; //Show success dialog

    console.log("Appointment updated successfully!");
    router.push({ name: "overviewPage" });
  } catch (error) {
    console.error("Error updating appointment:", error);
  }
};

const addAppointmentOption = () => {
  // Ensure that fk_appID is set to the current appointment's ID
  appointmentOptions.value.push({
    datum: "",
    id: null, // id being null is fine since db will handle it and generate a UUID
    fk_appID: appointmentId, //set FK to appointmentId
  });
};

const removeAppointmentOption = async (index) => {
  const option = appointmentOptions.value[index];
  const URL_REMOVE_APP_OPT = BACKEND_BASE_URL + "api/app/deleteAppOption/";
  if (option.id) {
    // If option has an ID, remove from backend
    try {
      const response = await fetch(
        URL_REMOVE_APP_OPT + option.id,
        // `http://localhost:8080/api/app/deleteAppOption/${option.id}`,
        { method: "DELETE", headers }
      );
      if (!response.ok)
        throw new Error(`Failed to delete option: ${response.statusText}`);
    } catch (error) {
      console.error("Error deleting option:", error);
      return;
    }
  }
  appointmentOptions.value.splice(index, 1); // Remove option locally
};

const closeSuccessDialog = () => {
  isSuccessDialogOpen.value = false;
  router.push({ name: "overviewPage" });
};

const cancel = () => {
  router.push({ name: "overviewPage" });
};

onMounted(async () => {
  // const appointmentId = route.params.appointmentId;
  const appointmentId = route.params.appointmentId;
  await fetchAppointment(appointmentId);
  await fetchAppointmentOptions(appointmentId);

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
h4,
h5 {
  color: var(--primary-text-color);
}

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

.appointment-options {
  margin-top: 20px;
}

.appointment-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.deadline-input-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  margin-right: 20px;
}

.q-btn {
  margin-top: 0px;
  margin-right: 20px;
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

/**
* Custom input field
*/

.custom-q-input {
  margin-bottom: 20px;
}

.custom-q-input .q-field__control {
  background-color: var(--secondary-bg-color);
  color: var(--accent-color);
}

.custom-q-input .q-field__label {
  color: var(--secondary-text-color); /* label-color */
}

.custom-q-input .q-field--focused .q-field__control {
  border-color: var(
    --accent-color
  ); /* You might want to adjust the border color on focus to match the accent color */
}

.custom-q-input .q-field--focused .q-field__label {
  color: var(--accent-color);
}

.custom-q-input .q-field__native {
  color: var(--primary-text-color); /* Set text color for input */
}

.custom-q-input .q-field__native::placeholder {
  color: var(--primary-text-color); /* Lighter color for placeholder text */
}

/**
* Custom icon
*/
.custom-q-icon {
  color: var(--primary-text-color);
}

/**
* Custom select field
*/
.custom-q-select {
  margin-bottom: 20px;
}

.custom-q-select .q-field__control {
  background-color: var(--secondary-bg-color);
  color: var(--accent-color);
}

.custom-q-select {
  color: var(--accent-color);
}

.custom-q-select .q-field__label {
  color: var(--secondary-text-color);
}

.custom-q-select .q-field--focused .q-field__control {
  border-color: var(--accent-color);
}

.custom-q-select .q-field--focused {
  color: var(--accent-color);
}

.custom-q-select .q-field__native {
  color: var(--primary-text-color);
}

.custom-q-select .q-field__native::placeholder {
  color: var(--primary-text-color);
}

.custom-q-select .q-field__native input,
.custom-q-select .q-select__input,
.custom-q-select .q-field__native .q-placeholder {
  color: var(--primary-text-color) !important;
}

/**
* Custom q-date
*/
/* Background color for whole card */
.q-date {
  background-color: var(--secondary-bg-color);
}

/* Header color */
.q-date .q-date__header {
  color: var(--primary-text-color);
  background-color: var(--accent-color);
}

/* Weekday color */
.q-date .q-date__calendar-item {
  color: var(--primary-text-color);
}

.q-date .q-date__calendar-item {
  color: var(--primary-text-color);
}

.q-date .q-btn:hover {
  background-color: var(--accent-color);
}

/**
* Custom q-time
*/
/* Background color for whole card */
.q-time {
  background-color: var(--secondary-bg-color);
  color: var(--primary-text-color);
}

/* Custom date Header Text color */
.q-time .q-time__header {
  color: var(--primary-text-color);
  background-color: var(--accent-color);
}

/* Clock Hand */
.q-time .q-time__clock-pointer {
  background-color: var(--accent-color);
  color: var(--accent-color);
}

/* Selected Time */
.q-time .q-time__clock-position--active {
  background-color: var(--accent-color);
}
</style>
