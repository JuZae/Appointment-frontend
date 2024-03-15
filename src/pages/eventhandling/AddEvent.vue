<template>
  <div class="appointment-erstellen-container">
    <h4>Appointment Erstellen</h4>

    <div class="form-container">
      <!-- Bezeichnung -->
      <div class="form-row">
        <label for="bezeichnung">Bezeichnung:</label>
        <q-input
          filled
          v-model="bez"
          placeholder="Bezeichnung eingeben"
          class="custom-q-input"
        />
      </div>

      <!-- Datum hinzufügen mit Zeitpicker -->
      <div class="form-row">
        <label for="datetime">Datum hinzufügen:</label>
        <!-- DAS HIER EINRÜCKEN -->
        <div class="datetime-input-container">
          <q-input
            filled
            v-model="date"
            class="custom-q-input"
            mask="####-##-## ##:##"
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer custom-q-icon">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Save" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn
            v-close-popup
            align="center"
            icon="add"
            @click="addDateToList"
            align:center
          />
        </div>
        <!-- DAS HIER KORREKT EINRÜCKEN -->
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
      </div>

      <!-- Standort -->
      <div class="form-row">
        <label for="standort">Standort:</label>
        <q-select
          filled
          outlined
          ref="selection"
          use-input
          :options="options"
          v-model="select"
          @input-value="onInput($event)"
          option-value="value"
          option-label="label"
          clearable
          class="custom-q-select"
          popup-content-class="custom-dropdown-style"
        />
      </div>

      <!-- Teilnehmer -->
      <div class="form-row">
        <label for="teilnehmer">Teilnehmer:</label>
        <q-select
          filled
          outlined
          label="Hinzufügen"
          v-model="parti"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add"
          class="custom-q-select"
        />
      </div>

      <!-- Deadline -->
      <div class="form-row">
        <label for="deadline">Deadline setzen</label>
        <q-input
          filled
          v-model="deadlineDate"
          class="custom-q-input"
          mask="####-##-## ##:##"
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer custom-q-icon">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="deadlineDate" mask="YYYY-MM-DD HH:mm">
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
                  v-model="deadlineDate"
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

      <!-- Beschreibung -->
      <div class="form-row">
        <label for="beschreibung">Beschreibung:</label>
        <q-input
          filled
          type="textarea"
          v-model="descr"
          placeholder="Beschreibung eingeben"
          class="custom-q-input"
        />
      </div>

      <!-- Button-Container -->
      <div class="button-container">
        <router-link to="/overviewpage">
          <q-btn label="Abbrechen" />
        </router-link>
        <q-btn label="Zurücksetzen" @click="this.$router.go(0)" />
        <router-link to="/overviewpage">
          <q-btn label="Speichern" @click="createAppointment" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRaw, inject } from "vue";
import UserStore from "src/stores/user.js";
import AuthStore from "src/stores/authStore.js";
import "src/css/app.scss";

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

//Stores
const userStore = UserStore.useStore();
const authStore = AuthStore.useStore();

//Authentication stuff
const jwtToken = authStore.token; //JWT Token (if exists)
// Create the authorization header
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  "Content-Type": "application/json",
  Accept: "application/json", // You can include other headers as needed
};

const selection = ref(null);
const options = ref([""]);

const bez = ref("");
const select = ref("");
const parti = ref(null);
const descr = ref("");

//Date for AppointmentOption creation
const date = ref("");
const addedDates = ref([]); //for each element in this list i

const addDateToList = () => {
  if (date.value) {
    addedDates.value.push(date.value);
  }
};

const deleteDateFromList = (index) => {
  addedDates.value.splice(index, 1);
};

//Deadline
const deadlineDate = ref("");

//API for saving an appointment
// const URL_SAVEAPP = "http://localhost:8080/api/app/saveApp";
const URL_SAVEAPP = BACKEND_BASE_URL + "api/app/saveApp";

//Create a new Appointment
//Required LocalDatemTime pattern: "yyyy-MM-dd HH:mm"
//f.ex. "2023-08-23 12:25"
const createAppointment = async () => {
  const data = {
    bez: bez.value,
    ort: select.value.value,
    teilnehmer: toRaw(parti.value).toString(),
    beschreibung: descr.value,
    fk_userID: userStore.userId,
    deadline: deadlineDate.value,
  };
  try {
    const response = await fetch(URL_SAVEAPP, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const responseData = await response.json();

    createAppointmentOptions(responseData.id);

    console.log("Response Data SAVEAPP:", JSON.stringify(responseData));
  } catch (error) {
    console.error("Error:", error.message);
  }
};

//Google Places API
// const URL_ADDR = "http://localhost:8080/api/address";
const URL_ADDR = BACKEND_BASE_URL + "api/address";
const onInput = async (event) => {
  //Mit dem selection habt Ihr Zugriff auf das DOM element
  //und mit showPopUp macht Ihr das Fenster auf
  selection.value.showPopup();

  try {
    const response = await fetch(`${URL_ADDR}?location=${event}`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      console.error("Error:", response.statusText);
      return;
    }

    const responseData = await response.json();
    options.value = responseData.map((cityString) => {
      return {
        value: cityString,
        label: cityString,
      };
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

//API for saving an appointmentOption
// const URL_SAVEAPPOPT = "http://localhost:8080/api/app/saveAppOption";
const URL_SAVEAPPOPT = BACKEND_BASE_URL + "api/app/saveAppOption";
const createAppointmentOptions = async (appointmentId) => {
  console.log("APPOPT-ISCALLED!!!" + appointmentId);
  for (const date of addedDates.value) {
    const data = {
      datum: date,
      fk_appID: appointmentId, // Assuming you have the ID of the appointment to link these options to
    };

    try {
      const response = await fetch(URL_SAVEAPPOPT, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error(
          `Request failed with status ${response.status}: ${response.statusText}`
        );
      }

      const responseData = await response.json();
      console.log("Response Data SAVEOPT:", JSON.stringify(responseData));

      console.log("Response Data for date: " + date + ":", responseData);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
};
</script>

<style>
.appointment-erstellen-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  /* background-color: #f9f9f9; */
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

.form-container {
  display: flex;
  flex-direction: column;
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

.form-row {
  margin-bottom: 20px;
  margin-top: 20px;
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

/* .test {
  color: var(--accent-color);
} */

.added-dates-list {
  display: flex;
  flex-direction: column;
}

.added-date {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
  /* Adjust padding and font-size for smaller screens */
  padding: 8px 12px; /* Default padding */
  font-size: 16px; /* Default font size */
}

@media (max-width: 360px) {
  .appointment-erstellen-container {
    padding: 10px;
  }

  .form-row label {
    display: block;
    margin-bottom: 5px;
  }

  .button-container {
    padding: 4px 8px; /* Even smaller padding */
    font-size: 12px; /* Even smaller font size */
    flex: 1; /* Make buttons take equal space */
    margin: 0 4px; /* Add some margin between buttons */
  }
  .button-container {
    flex-direction: column; /* Stack buttons vertically */
    gap: 10px; /* Add some space between stacked buttons */
  }
}

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

/**
* Custom icon
*/
.custom-q-icon {
  color: var(--primary-text-color);
}

/**
* Custom select field
*/
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
* Custom dropdown for q-select
*/
.custom-q-select,
.custom-dropdown-style {
  background-color: var(--secondary-bg-color);
  color: var(--accent-color);
}

/* Additional customizations for the dropdown items, if necessary */
.custom-dropdown-style .q-item {
  color: var(--primary-text-color);
  /* More styling rules as needed */
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
