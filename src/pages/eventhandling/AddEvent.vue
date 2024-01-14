<template>
  <head>
    <title>Terminerstellung</title>
    <title>Buttons</title>
    <title>Icons</title>
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
  </head>
  <body>
    <h4>Terminerstellung</h4>

    <table>
      <tr>
        <td><i class="material-icons">label</i></td>
        <td><label for="bezeichnung">Bezeichnung:</label></td>
        <td>
          <input
            v-model="bez"
            type="text"
            id="bezeichnung"
            name="bezeichnung"
          />
        </td>
      </tr>
      <tr>
        <td><i class="material-icons">today</i></td>
        <td><label for="deadline">Datum hinzufügen</label></td>
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
        <td><i class="material-icons">location_on</i></td>
        <td><label for="standort">Standort:</label></td>
        <td>
          <q-select
            outlined
            ref="selection"
            use-input
            :options="options"
            v-model="select"
            @input-value="onInput($event)"
            option-value="value"
            option-label="label"
          >
          </q-select>
        </td>
      </tr>
      <tr>
        <td><i class="material-icons">person</i></td>
        <td><label for="teilnehmer">Teilnehmer:</label></td>
        <td>
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
        </td>
      </tr>
      <tr>
        <td><i class="material-icons"> description</i></td>
        <td><label for="beschreibung">Beschreibung:</label></td>
        <td>
          <textarea
            v-model="descr"
            id="beschreibung"
            name="beschreibung"
          ></textarea>
        </td>
      </tr>
      <tr>
        <td><i class="material-icons">deadline</i></td>
        <td><label for="deadline">Deadline setzen</label></td>
        <td>
          <div class="q-pa-md deadline-input-container">
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
                        <q-btn
                          v-close-popup
                          label="Close"
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
                    <q-time
                      v-model="deadlineDate"
                      mask="YYYY-MM-DD HH:mm"
                      format24h
                    >
                      <div class="row items-center justify-end">
                        <q-btn
                          v-close-popup
                          label="Close"
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
      </tr>
    </table>

    <div class="button-container">
      <RouterLink to="/overviewpage">
        <q-btn label="Abbrechen" color="negative"></q-btn>
      </RouterLink>

      <q-btn label="Löschen" color="orange" @click="this.$router.go(0)"></q-btn>

      <RouterLink to="/overviewpage">
        <q-btn
          label="Speichern"
          color="positive"
          @click="createAppointment"
        ></q-btn>
      </RouterLink>
    </div>
  </body>
</template>

<script setup>
import { ref, toRaw } from "vue";
import UserStore from "src/stores/user.js";
import AuthStore from "src/stores/authStore.js";

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
const URL_SAVEAPP = "http://localhost:8080/api/app/saveApp";

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
const URL_ADDR = "http://localhost:8080/api/address";
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
const URL_SAVEAPPOPT = "http://localhost:8080/api/app/saveAppOption";
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
/* Reset CSS to remove default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #fff;
  padding: 10px;
}

/* Style the heading */
h4 {
  text-align: center;
  margin-bottom: 20px;
}

/* Style the table and its contents for left alignment */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

table tr,
table td,
table th {
  text-align: left;
  padding: 10px;
}

/* Style for input fields, textarea, and select boxes */
input[type="text"],
input[type="time"],
textarea,
.q-select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
  text-align: left; /* Ensure left alignment for text in inputs */
}

/* New style for the button container */
.button-container {
  display: flex;
  justify-content: flex-end; /* Align buttons to the right */
  gap: 10px; /* Space between buttons */
  margin-top: 20px; /* Space above the button container */
}

/* Adjusting button styles */
button {
  padding: 10px;
  color: #fff;
  background-color: #0056b3;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  /* Removing absolute positioning */
}

button:hover {
  background-color: #00408b;
}

/* Style for the deadline input */
.deadline-input .q-field__control {
  background: white;
  color: black; /* Adjust the text color if needed */
}

/* Style for the popup date and time pickers */
.deadline-input .q-date,
.deadline-input .q-time {
  background: white;
  color: black; /* Adjust the text color if needed */
}

.deadline-input-container {
  display: flex;
  align-items: center;
  padding-left: 0;
  padding-right: 0;
  margin-left: auto; /* Align to the right */
  margin-right: auto; /* Align to the right */
}

.deadline-input {
  width: 100%;
}

/* Styles for the added dates table */
.added-dates-table table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.added-dates-table th,
.added-dates-table td {
  padding: 8px;
  border: 1px solid #ddd;
  text-align: left;
}

.added-dates-table th {
  background-color: #f4f4f4;
}

/* Responsive adjustments for the added dates table */
@media screen and (max-width: 480px) {
  .added-dates-table table {
    font-size: 14px;
  }
}

@media screen and (max-width: 360px) {
  .added-dates-table table {
    font-size: 12px;
  }
}
</style>
