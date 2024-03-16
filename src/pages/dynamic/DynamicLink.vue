<template>
  <q-page>
    <!-- Participant Selection Dialog -->
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section class="row items-center justify-between">
          <div class="text-h6">Wähle einen Teilnehmer</div>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list>
            <q-item
              v-for="(participant, index) in participants"
              :key="index"
              clickable
              v-ripple
              @click="validateAndSelectParticipant(participant)"
            >
              <q-item-section>{{ participant }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Username eingeben</div>
          <q-input
            filled
            v-model="userName"
            placeholder="Name eingeben"
            class="custom-q-input"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" @click="isDialogOpen = false" />
          <q-btn
            flat
            label="Weiter"
            @click="validateAndSelectParticipant(userName)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Event Details -->
    <div v-if="eventDetails" class="event-details">
      <h2>{{ eventDetails.bez }}</h2>
      <p><strong>Ort:</strong> {{ eventDetails.ort }}</p>
      <p><strong>Beschreibung:</strong> {{ eventDetails.beschreibung }}</p>
      <p><strong>Deadline:</strong> {{ eventDetails.deadline }}</p>

      <!-- Display AppointmentOptions with q-slider -->
      <div class="q-mb-md">
        <q-slide-item
          v-for="option in appointmentOptions"
          :key="option.id"
          @left="userResponses[option.id] = true"
          @right="userResponses[option.id] = false"
          @action="resetSlide"
          left-color="green"
          right-color="red"
        >
          <template v-slot:left>
            <q-icon name="done" />
          </template>
          <template v-slot:right>
            <q-icon name="clear" />
          </template>

          <q-item>
            <q-item-section avatar>
              <q-avatar icon="alarm" class="slide-right-hint" />
            </q-item-section>
            <q-item-section>{{ option.datum }}</q-item-section>
            <q-item-section side>
              <q-icon
                :name="userResponses[option.id] ? 'done' : 'clear'"
                :color="userResponses[option.id] ? 'green' : 'red'"
            /></q-item-section>
          </q-item>
        </q-slide-item>
        <q-btn label="Abstimmen" @click="submitUserResponses" />
      </div>

      <!-- NEW -->
      <div
        v-for="option in appointmentOptions"
        :key="option.id"
        class="appointment-option q-mb-md"
      >
        <q-card class="my-card">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">{{ option.datum }}</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="q-mb-md">Verfügbar:</div>
            <q-list dense>
              <q-item
                v-for="participant in option.teilnehmerYes"
                :key="participant + 'yes'"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-avatar color="green" text-color="white">
                    <q-icon name="check" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ participant }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="q-mb-md">Nicht Verfügbar:</div>
            <q-list dense>
              <q-item
                v-for="participant in option.teilnehmerNo"
                :key="participant + 'no'"
                clickable
                v-ripple
              >
                <q-item-section avatar>
                  <q-avatar color="red" text-color="white">
                    <q-icon name="clear" />
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ participant }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- NEW -->
    </div>

    <!-- Success/Error Popup Dialog -->
    <q-dialog v-model="isPopupOpen">
      <q-card>
        <q-card-section class="row items-center justify-between">
          <div
            class="text-h6"
            :class="{
              'text-green': popupType === 'success',
              'text-red': popupType === 'error',
            }"
          >
            {{ popupMessage }}
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" @click="isPopupOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import UserStore from "src/stores/user";

const route = useRoute();

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

const userStore = UserStore.useStore();

const isDialogOpen = ref(true);
const userName = ref("");

const eventDetails = ref(null);
const userResponses = ref({});

const user = ref(null);

const participants = ref([]);
participants.value = ["Alice", "Bob", "Charlie"];

const appointmentOptions = ref([]);

const isPopupOpen = ref(false);
const popupMessage = ref("");
const popupType = ref(""); // 'success' or 'error'

function finalize(reset) {
  let timer = setTimeout(() => {
    reset();
  }, 1000);
}

function resetSlide({ reset }) {
  finalize(reset);
}

const startSlideAnimation = () => {
  const icons = document.querySelectorAll(".slideRightHint");
  icons.forEach((icon) => {
    icon.style.animation = "none";
    setTimeout(() => {
      icon.style.animation = "";
    }, 10);
  });
};

function validateAndSelectParticipant(participant) {
  if (!participant || participant.trim() === "") {
    popupMessage.value = "You must select or enter a Username.";
    popupType.value = "error";
    isPopupOpen.value = true;
    return;
  } else {
    user.value = participant;
    userStore.update(participant);
    userName.value = participant;
    addParticipantToAppointment();
    isDialogOpen.value = false;
  }
}
//API Call to add new participant if input field is filled
const API_ADD_PARTI = BACKEND_BASE_URL + "public/opt/add/addParticipant";
// const API_ADD_PARTI = "http://localhost:8080/public/opt/add/addParticipant";
const addParticipantToAppointment = async () => {
  if (!userName.value || userName.value.trim() === "") {
    console.error("Username is empty, cannot add participant");
    return;
  }
  try {
    const response = await fetch(API_ADD_PARTI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        appointmentId: route.params.appointmentId, // Make sure eventDetails has the id
        participant: userName.value,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const responseData = await response.json();
    // console.log("Participant added:", responseData);
  } catch (error) {
    console.error("Error adding participant:", error);
  }
};

//API Call to get Appointment by id
// const API_GET_APP = "http://localhost:8080/public/opt/getApp/";
const API_GET_APP = BACKEND_BASE_URL + "public/opt/getApp/";

const fetchAppointment = async (appointmentId) => {
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

    const responseData = await response.json();

    if (responseData) {
      //Teilnehmer in Liste packen
      const participantsStr = responseData.teilnehmer;
      participants.value = participantsStr.split(",");

      //TODO:Hier dann das Appointment für die Darstellung setzen
      eventDetails.value = {
        bez: responseData.bez,
        ort: responseData.ort,
        beschreibung: responseData.beschreibung,
        deadline: responseData.deadline,
        fk_userID: responseData.fk_userID,
        dateOptions: fetchAppointmentOptions(appointmentId).datum, // Define how date options are structured
      };

      return responseData;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

////API Call to get AppointmentOptions by Appoinment id
// const API_GET_APP_OPT = "http://localhost:8080/public/opt/getOpt/";
const API_GET_APP_OPT = BACKEND_BASE_URL + "public/opt/getOpt/";
const fetchAppointmentOptions = async (appointmentId) => {
  let fullURL = API_GET_APP_OPT + appointmentId;
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

    const responseData = await response.json();

    if (responseData) {
      //TODO:Hier dann die AppointmentOptions für die Darstellung setzen
      appointmentOptions.value = responseData;
      // console.log("APPOPTIONSDYNAMIC: " + JSON.stringify(appointmentOptions));

      // Initialize userResponses
      responseData.forEach((opt) => {
        userResponses.value[opt.id] = false; // Initialize as false
      });

      return responseData;
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
};

// Submit user responses
const submitUserResponses = async () => {
  if (!userName.value || userName.value.trim() === "") {
    popupMessage.value = "You must select or enter a Username to vote.";
    popupType.value = "error";
    isPopupOpen.value = true;
  } else {
    for (const option of appointmentOptions.value) {
      const userResponse = userResponses.value[option.id];
      let updatedOption = { ...option };

      // initialize participant lists if they don't already exist
      updatedOption.teilnehmerYes = updatedOption.teilnehmerYes || [];
      updatedOption.teilnehmerNo = updatedOption.teilnehmerNo || [];

      // remove usernaem from both lists initially
      const yesIndex = updatedOption.teilnehmerYes.indexOf(userName.value);
      if (yesIndex >= 0) updatedOption.teilnehmerYes.splice(yesIndex, 1);

      const noIndex = updatedOption.teilnehmerNo.indexOf(userName.value);
      if (noIndex >= 0) updatedOption.teilnehmerNo.splice(noIndex, 1);

      // add the username back to the appropriate list
      if (userResponse) {
        updatedOption.teilnehmerYes.push(userName.value);
      } else {
        updatedOption.teilnehmerNo.push(userName.value);
      }

      // Call the method to update the backend
      await editAppointmentOption(updatedOption);
    }
  }
};

//API to Edit the participants on an appointmentOption
// const API_EDIT_APPOPT = "http://localhost:8080/public/opt/edit";
const API_EDIT_APPOPT = BACKEND_BASE_URL + "public/opt/edit";
// Example of a method to edit an appointment
const editAppointmentOption = async (appointmentOption) => {
  if (userName.value) {
    // console.log("Wird geschickt" + JSON.stringify(appointmentOption));
    // console.log(
    //   "TeilnehmerYes" + JSON.stringify(appointmentOption.teilnehmerYes)
    // );

    try {
      const response = await fetch(API_EDIT_APPOPT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appointmentOption),
      });

      if (!response.ok) {
        // If the response status is 403, it means the deadline has passed
        if (response.status === 403) {
          popupMessage.value =
            "The deadline for editing this appointment has passed.";
          popupType.value = "error";
        } else {
          // Handle other errors
          popupMessage.value = `Error editing appointment: ${response.statusText}`;
          popupType.value = "error";
        }
      } else {
        // Handle successful edit
        popupMessage.value = "Appointment edited successfully";
        popupType.value = "success";
      }
      isPopupOpen.value = true; // Show the popup
    } catch (error) {
      console.error("Error editing appointment:", error);
      popupMessage.value = `Error editing appointment: ${error.message}`;
      popupType.value = "error";
      isPopupOpen.value = true; // Show the popup
    }
  }
};

onMounted(async () => {
  const appointmentId = route.params.appointmentId;

  console.log(
    "Appointment" + JSON.stringify(await fetchAppointment(appointmentId))
  );
  console.log(
    "Options" + JSON.stringify(await fetchAppointmentOptions(appointmentId))
  );
});
</script>

<style>
h2,
p {
  color: var(--primary-text-color);
  margin-bottom: 10px;
}

.event-details {
  margin: 20px;
  padding: 20px;
}

.text-green {
  color: green;
}
.text-red {
  color: red;
}

/* NEW */

/**
* Custom input field
*/
.custom-q-input .q-field__control {
  background-color: var(--secondary-bg-color);
  color: var(--accent-color);
}

.custom-q-input .q-field__label {
  color: var(--accent-color); /* label-color */
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

/**NEW */
.event-details {
  background-color: var(--primary-bg-color);
  border-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

/**
* Slider
*/
.q-slide-item {
  border: 1px solid var(--secondary-bg-color); /* Match your theme */
  border-radius: 20px; /* Rounded corners */
  overflow: hidden; /* Ensure the background color fills the border radius */
  margin-bottom: 5px;
  background-color: var(--secondary-bg-color);
}

/**
* Participant List/Card
*/
.appointment-option {
  background-color: var(--secondary-bg-color);
  border-radius: 20px;
}

.my-card {
  border-radius: 20px;
  max-width: 400px;
  margin: auto;
  display: contents;
  padding: 0px;
  background-color: var(--secondary-bg-color);
}

.q-avatar {
  /* Anpassung der Größe und des Stils der Avatare */
  font-size: 20px;
  color: var(--primary-text-color);
  background-color: var(--accent-color);
}

.q-item {
  margin-bottom: 5px;
}

/**
* Slide indicator (bounce animation)
*/
@keyframes slideRightHint {
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(10px);
  }
  100% {
    transform: translateX(0);
  }
}

.slide-right-hint {
  animation: slideRightHint 2s ease-in-out infinite;
}
</style>
