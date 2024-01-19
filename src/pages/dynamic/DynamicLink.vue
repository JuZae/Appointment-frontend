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
              @click="selectParticipant(participant)"
            >
              <q-item-section>{{ participant }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section>
          <div class="text-h6">Username eingeben</div>
          <q-input v-model="userName" label="Name" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Abbrechen" @click="isDialogOpen = false" />
          <q-btn flat label="Weiter" @click="selectParticipant(userName)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Event Details -->
    <div v-if="eventDetails" class="event-details">
      <h2>{{ eventDetails.bez }}</h2>
      <p><strong>Ort:</strong> {{ eventDetails.ort }}</p>
      <p><strong>Beschreibung:</strong> {{ eventDetails.beschreibung }}</p>
      <p><strong>Deadline:</strong> {{ eventDetails.deadline }}</p>

      <!-- Display AppointmentOptions with toggle switches -->
      <div
        v-for="option in appointmentOptions"
        :key="option.id"
        class="q-mb-md"
      >
        <div>{{ option.datum }}</div>
        <q-toggle
          color="green"
          checked-icon="check"
          unchecked-icon="clear"
          v-model="userResponses[option.id]"
        />
      </div>

      <q-btn label="Abstimmen" color="green" @click="submitUserResponses" />
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
import { ref, onMounted } from "vue";
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

const appointmentOptions = ref([]);

const isPopupOpen = ref(false);
const popupMessage = ref("");
const popupType = ref(""); // 'success' or 'error'

function selectParticipant(participant) {
  console.log("Selected participant:", participant);
  addParticipantToAppointment();
  if (participant) {
    user.value = participant;
    userStore.update(participant);
    userName.value = participant;
  }
  // Handle participant selection logic here
  isDialogOpen.value = false;
}

//API Call to add new participant if input field is filled
const API_ADD_PARTI = "http://localhost:8080/public/opt/add/addParticipant";
const addParticipantToAppointment = async () => {
  if (userName.value) {
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
      console.log("Participant added:", responseData);
    } catch (error) {
      console.error("Error adding participant:", error);
    }
  }
};

//API Call to get Appointment by id
const API_GET_APP = "http://localhost:8080/public/opt/getApp/";

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
const API_GET_APP_OPT = "http://localhost:8080/public/opt/getOpt/";
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
  appointmentOptions.value.forEach(async (option) => {
    const userResponse = userResponses.value[option.id];
    const updatedOption = {
      ...option,
      teilnehmerYes: userResponse ? [userName.value] : option.teilnehmerYes,
      teilnehmerNo: !userResponse ? [userName.value] : option.teilnehmerNo,
    };

    await editAppointmentOption(updatedOption); // Method to send update to backend
  });
};

//API to Edit the participants on an appointmentOption
const API_EDIT_APPOPT = "http://localhost:8080/public/opt/edit";
// Example of a method to edit an appointment
const editAppointmentOption = async (appointmentOption) => {
  console.log("Wird geschickt" + JSON.stringify(appointmentOption));
  console.log(
    "TeilnehmerYes" + JSON.stringify(appointmentOption.teilnehmerYes)
  );

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
.event-details {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #f9f9f9;
}
.event-details h2 {
  margin-bottom: 10px;
  color: #333;
}
.event-details p {
  margin-bottom: 5px;
  color: #555;
}
.text-green {
  color: green;
}
.text-red {
  color: red;
}
</style>
