<template>
  <div class="appointment-erstellen-container">
    <h4>Appointment Erstellen</h4>

    <div class="form-container">
      <!-- Bezeichnung -->
      <div class="form-row">
        <label for="bezeichnung">Bezeichnung:</label>
        <q-input filled v-model="bez" placeholder="Bezeichnung eingeben" />
      </div>

      <!-- Datum hinzufügen mit Zeitpicker -->
      <div class="form-row">
        <label for="datetime">Datum hinzufügen:</label>
        <!-- DAS HIER EINRÜCKEN -->
        <div class="datetime-input-container">
          <q-input filled v-model="date" class="datetime-input">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Save" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn v-close-popup icon="add" label="Add" @click="addDateToList" />
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
          outlined
          ref="selection"
          use-input
          :options="options"
          v-model="select"
          @input-value="onInput($event)"
          option-value="value"
          option-label="label"
          clearable
        />
      </div>

      <!-- Teilnehmer -->
      <div class="form-row">
        <label for="teilnehmer">Teilnehmer:</label>
        <q-select
          outlined
          label="Hinzufügen"
          v-model="parti"
          use-input
          use-chips
          multiple
          hide-dropdown-icon
          input-debounce="0"
          new-value-mode="add"
        />
      </div>

      <!-- Deadline -->
      <div class="form-row">
        <label for="deadline">Deadline setzen</label>
        <q-input filled v-model="deadlineDate" class="deadline-input">
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
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
            <q-icon name="access_time" class="cursor-pointer">
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
          type="textarea"
          v-model="descr"
          placeholder="Beschreibung eingeben"
        />
      </div>

      <!-- Button-Container -->
      <div class="button-container">
        <router-link to="/overviewpage">
          <q-btn label="Abbrechen" />
        </router-link>
        <q-btn label="Eingaben zurücksetzen" @click="this.$router.go(0)" />
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

.datetime-input-container,
.deadline-intput-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
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
}

@media (max-width: 480px) {
  .appointment-erstellen-container {
    padding: 10px;
  }

  .form-row label {
    display: block;
    margin-bottom: 5px;
  }
}
</style>
