<!-- <div>
    <h2>Appointment Details</h2>
    <p>
      {{ appointmentId }}
    </p>
    <p>
      {{ appointment }}
    </p>
  </div> -->
<template>
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

  <q-page>
    <q-card class="q-mb-md">
      <q-card-section class="q-pa-md">
        <div class="q-gutter-md">
          <q-item label="Bezeichnung" sublabel="Label for 'bez' property">
            {{ bez }}
          </q-item>
          <q-item label="Datum" sublabel="Label for 'datum' property">
            {{ datum }}
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
const datum = ref(null);
const ort = ref(null);
const teilnehmer = ref(null);
const beschreibung = ref(null);

const appointmentId = ref(null);
const route = useRoute();

const appointment2 = ref({
  id: "noID",
  bez: "noBez",
  datum: "noDate",
  ort: "noOrt",
  teilnehmer: "nobody",
  beschreibung: "noBeschr",
  fk_userID: "irgendneId",
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

const appointmentOption = {
  datum: "2023-10-21 11:00",
};

async function createNewOption() {
  try {
    console.log(appointmentOption);
    const URL_GETAPPBYID = `http://localhost:8080/api/updateAppById/${appointmentId.value}`;
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

    console.log("Response Data:", responseData);

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

onMounted(async () => {
  appointmentId.value = route.params.appointmentId;
  const appointment = await getAppointmentById();
  appointment2.value = appointment;
  if (appointment2.value[0]) {
    bez.value = appointment2.value[0].bez;
    datum.value = appointment2.value[0].datum;
    ort.value = appointment2.value[0].ort;
    teilnehmer.value = appointment2.value[0].teilnehmer;
    beschreibung.value = appointment2.value[0].beschreibung;
  }
});

// Function to reload the page
const reloadPage = () => {
  location.reload();
};

// Listen for the popstate event (e.g., when the URL is manually changed)
onMounted(() => {
  window.addEventListener("popstate", reloadPage);
  //TODO: Here we should make an API call to the backend using our AppointmentID to get all the necessary information
});

// Remove the event listener when the component is unmounted
onBeforeUnmount(() => {
  window.removeEventListener("popstate", reloadPage);
});
</script>
