<template>
  <q-page padding>
    <div class="q-pa-md" v-if="appointment">
      <h4>Appointment bearbeiten</h4>
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
          new-value-mode="add" />

        <q-input
          type="textarea"
          v-model="appointment.beschreibung"
          label="Beschreibung" />

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
        <!-- Appointment Options Section -->
        <div class="appointment-options">
          <h5>Appointment Options</h5>
          <div
            class="appointment-option"
            v-for="(option, index) in appointmentOptions"
            :key="index"
          >
            <q-input
              filled
              v-model="option.datum"
              mask="YYYY-MM-DD HH:mm"
              label="Option Date"
            />
            <q-btn
              icon="delete"
              color="negative"
              @click="removeAppointmentOption(index)"
            />
          </div>
          <q-btn
            label="Add Option"
            color="primary"
            @click="addAppointmentOption"
          />
        </div>
        <!-- NEW AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA -->
        <tr>
          <td>
            <div class="q-pa-md deadline-input-container">
              <q-input filled v-model="date" class="deadline-input">
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      cover
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Save"
                            color="primary"
                            flat
                          />
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
                      <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Save"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </td>
          <td>
            <q-btn
              v-close-popup
              icon="add"
              label="Add"
              color="primary"
              @click="addDateToList"
            />
          </td>
        </tr>
        <tr>
          <td />
          <td />
          <td>
            <div class="added-dates-table">
              <table>
                <thead>
                  <tr>
                    <th>Mögliche Zeitpunkte</th>
                    <th>Löschen</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(addedDate, index) in addedDates" :key="index">
                    <td>{{ addedDate }}</td>
                    <td>
                      <q-btn
                        icon="delete"
                        flat
                        @click="deleteDateFromList(index)"
                      ></q-btn>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </td>
        </tr>
        <tr>
          <!-- NEW AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA-->
          <div class="row justify-center q-mt-md">
            <q-btn label="Speichern" type="submit" color="primary" />
            <q-btn label="Abbrechen" color="negative" @click="cancel" />
          </div></tr
      ></q-form>
    </div>

    <!-- Success Dialog -->
    <q-dialog v-model="isSuccessDialogOpen">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="check" color="green" />
          <span class="q-ml-sm">Appointment updated successfully!</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Close"
            color="primary"
            @click="closeSuccessDialog"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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

const fetchAppointmentOptions = async () => {
  const appointmentId = route.params.appointmentId;
  const API_GET_APP =
    "http://localhost:8080/public/opt/getOpt/" + appointmentId;
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
      console.log("OPtions oder so: " + JSON.stringify(responseData));
    }
  } catch (error) {
    console.error("Error fetching appointment:", error);
  }
};

const saveChanges = async () => {
  saveAppointment();
  saveAppointmentOptions();
  isSuccessDialogOpen.value = true;
};

const saveAppointment = async () => {
  appointment.value.teilnehmer = participantList.value.join(",");

  const API_SAVE_APP = "http://localhost:8080/api/app/saveApp";
  const API_SAVE_OPT = "http://localhost:8080/api/app/saveAppOption";
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
  appointmentOptions.value.push({ datum: "", id: null }); // Add new option
};

const removeAppointmentOption = async (index) => {
  const option = appointmentOptions.value[index];
  if (option.id) {
    // If option has an ID, remove from backend
    try {
      const response = await fetch(
        `http://localhost:8080/api/app/deleteAppOption/${option.id}`,
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
  const appointmentId = route.params.appointmentId;
  await fetchAppointment();
  await fetchAppointmentOptions();

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

.appointment-options {
  margin-top: 20px;
}

.appointment-option {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.appointment-option q-input {
  margin-right: 10px;
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
