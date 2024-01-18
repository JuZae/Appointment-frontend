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

    <!-- <div class="q-mt-md">Selected: {{ JSON.stringify(selected) }}</div> -->
  </div>

  <div class="flex-container">
    <div class="flex-item">
      <q-btn
        id="bearbeiten"
        fab
        icon="add"
        color="orange"
        @click="navigateToDynamicLink"
        >Abstimmung öffnen</q-btn
      >
    </div>
    <div class="flex-item">
      <q-btn
        id="edit"
        fab
        icon="edit"
        color="secondary"
        @click="navigateToEditPage"
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
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserStore from "src/stores/user";
import AuthStore from "src/stores/authStore";

//Router
const router = useRouter(); // Vue Router instance

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

//TODO: Reload Page after routing from AddEvent to Overviewpage
const rows = ref([]);

const selected = ref([]);

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
  {
    name: "deadline",
    label: "Deadline",
    field: "deadline",
    sortable: true,
    align: "left",
  },
];

// Navigates to the dynamic link based on the selected appointment
const navigateToDynamicLink = () => {
  if (selected.value && selected.value.length > 0) {
    const dynamicId = selected.value[0].id;
    router.push(`/dynamic-link/${dynamicId}`);
  } else {
    router.push("/overviewpage"); // Navigate back to overview page if no selection
  }
};

// Navigates to page to edit appointment
const navigateToEditPage = () => {
  if (selected.value && selected.value.length > 0) {
    const appointmentId = selected.value[0].id;
    router.push({ name: "editAppointment", params: { appointmentId } });
  } else {
    // Handle the case when no appointment is selected
  }
};

/**
 * Get Data from Backend
 */
//API
const URL_GETALLBYUID = "http://localhost:8080/api/app/getAppByUserId/";

//GET Call
const getAllAppointmentsByUserID = async () => {
  // console.log("TOKEN: " + localStorage.getItem("userToken"));
  let fullURL = URL_GETALLBYUID + userStore.userId;
  try {
    const response = await fetch(fullURL, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    rows.value = responseData; //Update rows
  } catch (error) {
    console.error("Error:", error.message);
  }
};

onMounted(async () => {
  console.log("TOKEN :" + localStorage.getItem("userToken"));
  await getAllAppointmentsByUserID();
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
