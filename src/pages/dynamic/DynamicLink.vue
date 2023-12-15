<template>
  <!-- POPUP -->
  <q-dialog v-model="login" persistent>
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Username eingeben</div>
      </q-card-section>
      <q-card-section v-model="popupVisible">
        <q-input
          v-model="username"
          filled
          type="username"
          hint="Username"
          :rules="[
            (val) => (val && val.length > 0) || 'Name must be filled in.',
          ]"
        >
          <template v-slot:append>
            <q-icon name="user" />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right" class="text-primary">
        <q-btn
          id="abbrechen"
          flat
          v-close-popup
          @click="this.$router.go(0)"
          color="primary"
          no-caps
          >Abbrechen</q-btn
        >
        <q-btn
          id="weiter"
          flat
          v-close-popup
          @click="saveUserName(username)"
          color="primary"
          no-caps
          >Weiter</q-btn
        >
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- Page   -->
  <q-page>
    <q-card class="q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="q-gutter-md">
          <q-item label="Bezeichnung" sublabel="Label for 'bez' property">
            {{ bez }}
          </q-item>
          <q-item label="Ort" sublabel="Label for 'ort' property">
            {{ ort }}
          </q-item>
          <q-item label="Teilnehmer" sublabel="Label for 'teilnehmer' property">
            {{ teilnehmer }}
          </q-item>
          <q-item
            label="Beschreibung"
            sublabel="Label for 'beschreibung' property"
          >
            {{ beschreibung }}
          </q-item>
        </div>
      </q-card-section>
    </q-card>

    <div class="flex-container">
      <div class="flex-item">
        <q-btn
          id="hinzufügen"
          fab
          icon="add"
          color="orange"
          @click="createNewOption()"
          >Abschicken</q-btn
        >
      </div>
    </div>
    <!-- List of options -->
    <div class="q-pa-md">
      <q-table
        flat
        bordered
        title="Terminübersicht"
        :rows="rows"
        :columns="columns"
        row-key="id"
        selection="single"
        v-model:selected="selected"
        color="blue"
      >
      </q-table>

      <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import LStore from "src/stores/user";

const $my_usern = LStore.useStore();
const { username } = storeToRefs($my_usern);
const login = ref(true);

const rows = ref([]);
const selected = ref([]);

//TODO: Hier noch den Ersteller des Termins irgendwie mit reinbringen (vllt. auch über die Termine)
const columns = [
  {
    name: "id",
    required: true,
    align: "left",
    sortable: true,
  },
  {
    name: "teilnehmerYes",
    label: "Zugesagt",
    field: "teilnehmerYes",
    sortable: true,
    align: "left",
  },
  {
    name: "teilnehmerNo",
    label: "Abgesagt",
    field: "teilnehmerNo",
    sortable: true,
    align: "left",
  },
];

//TODO: Das hier nur ausführen wenn eingabe valide und man auf weiter geklickt hat
//      anschließend zwischenspeicherung des username und beim senden des post mitgeben
const saveUserName = ($username) => {
  if ($username.length <= 0) {
    //TODO: Hier noch überlegen was sinnvoll wäre (Stichwort input Validierung) -> evtl. Seite neu laden oder so
    console.log("Hier den Input validieren");
  } else {
    $my_usern.update($username);
  }
};

const bez = ref(null);
const ort = ref(null);
const teilnehmer = ref(null);
const beschreibung = ref(null);

const appointmentId = ref(null);
const route = useRoute();

//FIXME: Das hier ist nur testweise so gelöst
// const appointmentOption = {
//   id: "",
//   datum: "2023-10-21 11:00",
//   teilnehmerYes: "Hans, Peter",
//   teilnehmerNo: "Jocha",
//   fk_appID: "a09b625b-ef0a-4f18-9937-f7032e214c49",
// };

const appointment2 = ref({
  id: "",
  bez: "",
  ort: "",
  teilnehmer: "",
  beschreibung: "",
  fk_userID: "",
});

async function getAppointmentById() {
  try {
    const URL_GETAPPBYID = `http://localhost:8080/api/getAppById/${appointmentId.value}`;
    const response = await fetch(URL_GETAPPBYID, {
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

    console.log("Response Data:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

async function createNewOption() {
  try {
    // const URL_GETAPPBYID = `http://localhost:8080/api/updateAppById/${appointmentId.value}`;
    const URL_GETAPPBYID = `http://localhost:8080/api/updateAppById/${"b0f80c25-a631-478a-ada3-4c7b962e819f"}`;
    const response = await fetch(URL_GETAPPBYID, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentOption),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    //FIXME
    console.log("All possible Times for this App:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Function to reload the page
const reloadPage = () => {
  location.reload();
};

// Listen for the popstate event (e.g., when the URL is manually changed)
onMounted(async () => {
  window.addEventListener("popstate", reloadPage);
  //TODO: Here we should make an API call to the backend using our AppointmentID to get all the necessary information
  appointmentId.value = route.params.appointmentId;
  const appointment = await getAppointmentById();
  appointment2.value = appointment;
  if (appointment2.value[0]) {
    bez.value = appointment2.value[0].bez;
    ort.value = appointment2.value[0].ort;
    teilnehmer.value = appointment2.value[0].teilnehmer;
    beschreibung.value = appointment2.value[0].beschreibung;
  }
});

// Remove the event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener("popstate", reloadPage);
});
</script>
