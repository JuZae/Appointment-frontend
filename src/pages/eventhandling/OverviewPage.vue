<template>
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

  <div class="flex-container">
    <div class="flex-item">
      <q-btn
        id="bearbeiten"
        fab
        icon="add"
        color="orange"
        @click="navigateToDynamicLink"
        >Bearbeiten</q-btn
      >
    </div>
  </div>

  <RouterLink to="/addEvent">
    <div>
      <q-page-sticky id="addEvent" position="bottom-right" :offset="[10, 10]">
        <q-btn fab icon="add" color="blue">Neuen Termin</q-btn>
      </q-page-sticky>
    </div>
  </RouterLink>
</template>

<script setup>
/**
//TODO
 * Ideen:
 * 1. Man könnte hier noch für den Ort ein Icon das auf einen auf
 *    Google Maps weiterleitet einbauen
 * 2. Button rechts pro Termin um ihn direkt in Google Calendar einzutragen
 *    oder halt als .ics Datei zu exportieren
 * 3. Teilnehmer als Liste ausklappen
 * 4. Beschreibung als Popup aufklappen können wenn sie etwas länger ist
 */
import { ref, onMounted } from "vue";
import { storeToRefs } from "pinia";
import UserStore from "src/stores/user";

const user = UserStore.useStore();

//APIs
const URL_GETALL = "http://localhost:8080/api/app/getAll";
const URL_GETALLBYUID = "http://localhost:8080/api/app/getAppByUserId/";

const columns = [
  {
    name: "id",
    required: true,
    align: "left",
    sortable: true,
  },

  {
    name: "bez",
    label: "Bezeichnung",
    field: "bez",
    sortable: true,
    align: "left",
  },
  { name: "ort", label: "Ort", field: "ort", sortable: true, align: "left" },
  {
    name: "teilnehmer",
    label: "Teilnehmer",
    field: "teilnehmer",
    sortable: true,
    align: "left",
  },
  {
    name: "beschreibung",
    label: "Beschreibung",
    field: "beschreibung",
    sortable: true,
    align: "left",
  },
];
//TODO: Reload Page after routing from AddEvent to Overviewpage
const rows = ref([]);

const selected = ref([]);

//FIXME: This is not how you should reroute in VueJS -> should rather use the router (didn't work when i tried)
const navigateToDynamicLink = async () => {
  const link = await generateHref();
  if (link) {
    window.location.href = link;
  }
};

const generateHref = async () => {
  if (selected.value && selected.value.length > 0) {
    const dynamicId = selected.value[0].id;
    const isSelected = `http://localhost:9000/#/dynamic-link/${dynamicId}`;
    return isSelected;
  } else {
    const isNotSelected = `http://localhost:9000/#/overviewpage`;
    return isNotSelected;
  }
};

const navigateToErrorPage = () => {
  console.log("ERRORPAGE NOW");
};

/**
 * Get Data from Backend
 */
async function getAllAppointmentsByUserID() {
  let fullURL = URL_GETALLBYUID + user.userId;
  console.log("ABCDEFGHIJKLMNOP " + fullURL);
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

    console.log("Overviewpage RESPONSE DATA: " + JSON.stringify(responseData));

    return responseData;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

onMounted(async () => {
  const appointments = await getAllAppointmentsByUserID();
  rows.value = appointments;
  // Update the reactive ref with the fetched data
});
</script>

<style>
.container {
  text-align: center;
}

.flex-container {
  display: flex;
  justify-content: space-between;
}

.flex-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align items to the right side */
  padding: 1rem; /* Add space around the button */
}

.left {
  flex: 2;
}

#zusagen {
  padding: 15px;
  margin: 15px;
  border-radius: 40px;
}

#absagen {
  padding: 15px;
  margin: 15px;
  border-radius: 40px;
}
</style>
