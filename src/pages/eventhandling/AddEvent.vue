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
        <td><label for="datum">Datum:</label></td>
        <td>
          <div class="q-pa-md">
            <q-date
              v-model="date"
              landscape
              @input-value="test($event)"
              mask="YYYY-MM-DD"
            />
          </div>
        </td>
        <td>
          <button type="button" id="btnAdd">Neue Uhrzeit hinzufügen</button>
        </td>
      </tr>
      <tr>
        <td><i class="material-icons"> schedule</i></td>
        <td><label for="uhrzeit">Uhrzeit:</label></td>
        <td>
          <input v-model="time" type="time" id="uhrzeit" name="uhrzeit" />
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
    </table>

    <RouterLink to="/overviewpage">
      <button @click="createAppointment()" type="button" id="btnCreate">
        Speichern
      </button>
    </RouterLink>

    <RouterLink to="/overviewpage">
      <button type="button" id="btnCancel">Abbrechen</button>
    </RouterLink>

    <button type="button" id="btnNew" @click="this.$router.go(0)">
      Löschen
    </button>
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
const date = ref("");
const time = ref("");
const select = ref("");
const parti = ref(null);
const descr = ref("");

//APIs
const URL_SAVEAPP = "http://localhost:8080/api/app/saveApp";
const URL_ADDR = "http://localhost:8080/api/address";

//Required LocalDatemTime pattern: "yyyy-MM-dd HH:mm"
//f.ex. "2023-08-23 12:25"

const createAppointment = async () => {
  let formattedDateTime = date.value + " " + time.value;
  const data = {
    bez: bez.value,
    datum: formattedDateTime,
    ort: select.value.value,
    teilnehmer: toRaw(parti.value).toString(),
    beschreibung: descr.value,
    fk_userID: userStore.userId,
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
    console.log("Response Data:", responseData);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

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
</script>

<style>
/* Reset CSS to remove default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  text-align: left;
}

/* Set a default font-family and background color */
body {
  font-family: Arial, sans-serif;
  background-color: #fff;
  padding: 10px;
}

/* Center the content on the page */
.template-container {
  max-width: 40px;
  margin: 0 auto;
}

/* Style the table */
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  text-align: left;
}

/*table td {
  padding: 10px;
  border: 1px solid #fff;
}*/

/* Style the heading */
h4 {
  text-align: center;
  margin-bottom: 20px;
}

/* Style the input fields and textarea */
input[type="text"],
input[type="time"],
textarea {
  margin-top: 10px;
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-bottom: 10px;
}

/* Style the select box */
.q-select {
  width: 100%;
  margin: 5px;
}

/* Style the buttons */
button {
  display: block;
  position: absolute;
  width: auto;
  padding: 10px;
  margin-bottom: 10px;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  width: 110px;
}

button:hover {
  background-color: #0056b3;
}

#btnCancel {
  right: 250px;
  background-color: #0056b3;
}

#btnCreate {
  right: 10px;
  background-color: #008000;
}

#btnNew {
  right: 130px;
  background-color: #b33300;
}

/* Responsive adjustments */
@media screen and (max-width: 480px) {
  table {
    font-size: 14px;
  }
}

@media screen and (max-width: 360px) {
  table {
    font-size: 12px;
  }
}
</style>
