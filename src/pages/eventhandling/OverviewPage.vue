<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      title="Appointment Übersicht"
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
    <div class="flex-item">
      <q-btn
        id="mail"
        fab
        icon="mail"
        color="primary"
        @click="navigateToMailPage"
        >Send E-Mail</q-btn
      >
    </div>
    <div class="flex-item">
      <q-btn
        color="negative"
        icon="delete"
        fab
        label="Löschen"
        @click="confirmDelete"
        :disable="!selected.length"
      />
    </div>
  </div>

  <!-- Confirmation Dialog -->
  <q-dialog v-model="isDeleteDialogOpen">
    <q-card>
      <q-card-section class="row items-center">
        <div class="text-h6">Confirm Delete</div>
      </q-card-section>
      <q-card-section>
        Are you sure you want to delete this appointment?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
        <q-btn
          flat
          label="Delete"
          color="negative"
          @click="deleteAppointment"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

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

const navigateToMailPage = () => {
  router.push({ name: "mailPage" });
};

/**
 * Get Data from Backend
 */

//GET Call for all app by userid
const getAllAppointmentsByUserID = async () => {
  //API
  const URL_GETALLBYUID =
    "http://49.13.170.189:8080/" + "api/app/getAppByUserId/";
  // const URL_GETALLBYUID = "http://localhost:8080/api/app/getAppByUserId/";
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

const isDeleteDialogOpen = ref(false);

// Show confirmation dialog
const confirmDelete = () => {
  isDeleteDialogOpen.value = true;
};

// Handle delete confirmation
const deleteAppointment = async () => {
  if (selected.value && selected.value.length > 0) {
    const appointmentId = selected.value[0].id; // Assuming single selection
    const API_DELETE_APP = `http://49.13.170.189:8080/api/app/deleteAppById/${appointmentId}`;
    // const API_DELETE_APP = `http://localhost:8080/api/app/deleteAppById/${appointmentId}`;

    try {
      const response = await fetch(API_DELETE_APP, {
        method: "DELETE",
        headers: headers,
      });

      if (!response.ok) {
        throw new Error(`Deletion failed: ${response.status}`);
      }

      console.log("Appointment deleted successfully!");
      isDeleteDialogOpen.value = false;
      // Refresh the table by fetching the appointments again
      await getAllAppointmentsByUserID();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  }
};

onMounted(async () => {
  // console.log("TOKEN :" + localStorage.getItem("userToken"));
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
