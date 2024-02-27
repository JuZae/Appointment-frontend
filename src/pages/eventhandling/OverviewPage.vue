<template>
  <body>
    <div class="q-pa-md">
      <q-table
        :rows="rows"
        row-key="id"
        :columns="columns"
        virtual-scroll
        binary-state-sort
        dense
        grid
        class="custom-table"
        :rows-per-page-options="[rows.length]"
        :hide-bottom="true"
      >
        <template v-slot:item="scope">
          <div class="card-parent">
            <q-card
              flat
              class="my-card"
              :class="{ 'selected-card': isSelected(scope.row.id) }"
            >
              <q-card-section @click="handleRowClick(scope.row)">
                <div class="card-content">
                  <div class="text-h6">
                    <q-icon name="event" /> {{ scope.row.bez }}
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="description" class="q-mr-sm" />
                    {{ scope.row.beschreibung }}
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="place" class="q-mr-sm" /> {{ scope.row.ort }}
                  </div>
                  <div class="row items-center q-mb-sm">
                    <q-icon name="group" class="q-mr-sm" />
                    {{ scope.row.teilnehmer }}
                  </div>
                  <div class="row items-center">
                    <q-icon name="schedule" class="q-mr-sm" />
                    {{ scope.row.deadline }}
                  </div>
                </div>
              </q-card-section>

              <q-separator class="separator" />

              <q-card-actions
                v-if="isSelected(scope.row.id)"
                class="card-actions"
              >
                <div class="button-container">
                  <q-btn
                    id="open"
                    fab
                    icon="event"
                    class="btn-open"
                    @click="navigateToDynamicLink(scope.row)"
                  >
                    <q-tooltip>Abstimmung öffnen</q-tooltip></q-btn
                  >
                  <q-btn
                    id="edit"
                    fab
                    icon="edit"
                    class="btn-edit"
                    @click.stop.prevent="navigateToEditPage(scope.row)"
                    ><q-tooltip>Appointment bearbeiten</q-tooltip></q-btn
                  >
                  <q-btn
                    id="copy"
                    fab
                    icon="content_copy"
                    class="btn-copy"
                    @click.stop.prevent="copyLinkToClipboard(scope.row)"
                    ><q-tooltip>In Zwischenablage kopieren</q-tooltip></q-btn
                  >
                  <q-btn
                    id="share"
                    fab
                    icon="share"
                    class="btn-share"
                    @click.stop.prevent="shareSocial(scope.row)"
                    ><q-tooltip>Termin teilen</q-tooltip></q-btn
                  >
                  <q-btn
                    id="mail"
                    fab
                    icon="mail"
                    class="btn-mail"
                    @click.stop.prevent="navigateToMailPage(scope.row)"
                    ><q-tooltip>Einladung versenden</q-tooltip></q-btn
                  >
                  <q-btn
                    id="delete"
                    fab
                    icon="delete"
                    class="btn-delete"
                    @click.stop.prevent="confirmDelete(scope.row)"
                    ><q-tooltip>Termin löschen</q-tooltip></q-btn
                  >
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="isSocialDialogOpen">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Share</div>
        </q-card-section>
        <q-card-actions>
          <ShareNetwork
            class="share"
            v-for="network in networks"
            :network="network.network"
            :key="network.network"
            :style="{ backgroundColor: network.color }"
            :url="sharing.url"
            :title="sharing.title"
            :description="sharing.description"
            :quote="sharing.quote"
            :hashtags="sharing.hashtags"
            :twitterUser="sharing.twitterUser"
            @click="shareSocial()"
          >
            <i :class="network.icon"></i>
            <span>{{ network.name }}</span>
          </ShareNetwork>
        </q-card-actions>
        <q-card-actions>
          <q-btn flat label="Cancel" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="isDeleteDialogOpen">
      <q-card>
        <q-card-section class="row items-center">
          <div class="text-h6">Confirm Delete</div>
        </q-card-section>
        <q-card-section
          >Are you sure you want to delete this appointment?</q-card-section
        >
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup></q-btn>
          <q-btn flat label="Delete" @click="deleteAppointment"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="flex-container">
      <q-page-sticky id="addEvent" position="bottom-right" :offset="[10, 10]">
        <q-btn
          fab
          icon="add"
          class="btn-new"
          @click="navigateToAddEvent"
        ></q-btn>
      </q-page-sticky>
    </div>
  </body>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import AuthStore from "src/stores/authStore";
import { ShareNetwork } from "vue-social-sharing";
import draggable from "vuedraggable";
import "src/css/app.scss";

const $q = useQuasar();

const rows = ref([]);

const selected = ref([]); // This now holds the selected rows' IDs

const selectedCardId = ref(null);

function handleRowClick(row) {
  // Toggle selection: if already selected, deselect; otherwise, select this row
  selected.value = [];
  selected.value = [row];
  selectedCardId.value = selectedCardId.value === row.id ? null : row.id;
}

function isSelected(id) {
  return selectedCardId.value === id;
}

//Router
const router = useRouter(); // Vue Router instance

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

//Stores
const authStore = AuthStore.useStore();

//Authentication stuff
const jwtToken = authStore.token; //JWT Token (if exists)
// Create the authorization header
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  "Content-Type": "application/json",
  Accept: "application/json", // You can include other headers as needed
};

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

/**
 * Share Flow
 */
const isSocialDialogOpen = ref(false);

//Show share dialog
const shareSocial = () => {
  setURLForSharing(); // Update the URL before showing the dialog
  isSocialDialogOpen.value = true;
};

const setURLForSharing = () => {
  if (selectedCardId.value && selected.value.length > 0) {
    const url = `${window.location.origin}/dynamic-link/${selectedCardId.value}`;
    console.log("URL !!!" + url.value);

    const title = `Einladung: ${JSON.stringify(selected.value[0].bez)}`;
    const description = `Du wurdest zu einer Veranstaltung in ${selected.value[0].ort} eingeladen.
    ${selected.value[0].beschreibung}`;

    sharing.value.url = url;
    sharing.value.title = title;
    sharing.value.description = description;

    console.log(JSON.stringify(sharing.value));
  }
};

const sharing = ref({
  url: ``,
  title: ``,
  description: "",
  quote: "The hot reload is so fast it's near instant. - Evan You",
  hashtags: "vuejs,vite,javascript,apoint",
  twitterUser: "apoint",
});

const networks = [
  {
    network: "email",
    name: "Email",
    icon: "far fah fa-lg fa-envelope",
    color: "#333333",
  },
  {
    network: "facebook",
    name: "Facebook",
    icon: "fab fah fa-lg fa-facebook-f",
    color: "#1877f2",
  },
  {
    network: "flipboard",
    name: "Flipboard",
    icon: "fab fah fa-lg fa-flipboard",
    color: "#e12828",
  },
  {
    network: "linkedin",
    name: "LinkedIn",
    icon: "fab fah fa-lg fa-linkedin",
    color: "#007bb5",
  },
  {
    network: "messenger",
    name: "Messenger",
    icon: "fab fah fa-lg fa-facebook-messenger",
    color: "#0084ff",
  },
  {
    network: "reddit",
    name: "Reddit",
    icon: "fab fah fa-lg fa-reddit-alien",
    color: "#ff4500",
  },
  {
    network: "skype",
    name: "Skype",
    icon: "fab fah fa-lg fa-skype",
    color: "#00aff0",
  },
  {
    network: "sms",
    name: "SMS",
    icon: "far fah fa-lg fa-comment-dots",
    color: "#333333",
  },
  {
    network: "telegram",
    name: "Telegram",
    icon: "fab fah fa-lg fa-telegram-plane",
    color: "#0088cc",
  },
  {
    network: "twitter",
    name: "Twitter",
    icon: "fab fah fa-lg fa-twitter",
    color: "#1da1f2",
  },
  {
    network: "whatsapp",
    name: "Whatsapp",
    icon: "fab fah fa-lg fa-whatsapp",
    color: "#25d366",
  },
  {
    network: "wordpress",
    name: "Wordpress",
    icon: "fab fah fa-lg fa-wordpress",
    color: "#21759b",
  },
  {
    network: "xing",
    name: "Xing",
    icon: "fab fah fa-lg fa-xing",
    color: "#026466",
  },
];

//Navigates to add Event page
const navigateToAddEvent = () => {
  router.push("/addEvent");
};

// Navigates to the dynamic link based on the selected appointment
const navigateToDynamicLink = () => {
  if (selected.value && selected.value.length > 0 && selectedCardId.value) {
    const dynamicId = selectedCardId.value;
    router.push(`/dynamic-link/${dynamicId}`);
  } else {
    router.push("/overviewpage"); // Navigate back to overview page if no selection
  }
};

// Navigates to page to edit appointment
const navigateToEditPage = () => {
  if (selected.value && selected.value.length > 0 && selectedCardId.value) {
    const appointmentId = selectedCardId.value;
    if (appointmentId) {
      router.push({ name: "editAppointment", params: { appointmentId } });
    }
  } else {
    // Handle the case when no appointment is selected
  }
};

const navigateToMailPage = () => {
  if (selected.value && selected.value.length > 0) {
    const appointmentId = selected.value[0].id;
    router.push({
      name: "MailPage",
      params: { appointmentId },
    });
  } else {
    // Handle case where no appointment is selected
  }
};

/**
 * Get Data from Backend
 */

//GET Call for all app by userid
const getAllAppointmentsByUserID = async () => {
  //API
  const URL_GETALLBYUID = BACKEND_BASE_URL + "api/app/getAppByUserId/";
  let fullURL = URL_GETALLBYUID + (await localStorage.getItem("userId"));
  if (localStorage.getItem("userId")) {
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
  }
};

/**
 * Delete Flow
 */
const isDeleteDialogOpen = ref(false);

// Show confirmation dialog
const confirmDelete = () => {
  isDeleteDialogOpen.value = true;
};

// Handle delete confirmation
const deleteAppointment = async () => {
  if (selected.value && selected.value.length > 0 && selectedCardId.value) {
    const appointmentId = selectedCardId.value; // Assuming single selection
    const API_DELETE_APP = `${BACKEND_BASE_URL}api/app/deleteAppById/${appointmentId}`;
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

/**
 * Copy to clipboard (with workaround)
 */
// Function to copy text to clipboard using execCommand (as a fallback)
function unsecuredCopyToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand("copy");
    const msg = successful ? "successful" : "unsuccessful";
    console.log("Fallback: Copying text command was " + msg);
  } catch (err) {
    console.error("Fallback: Oops, unable to copy", err);
  }
  document.body.removeChild(textArea);
}

// Build the dynamic-link and copy it to the clipboard
const copyLinkToClipboard = () => {
  if (selected.value && selected.value.length > 0) {
    const dynamicId = selected.value[0].id;
    const dynamicLink = `${window.location.origin}/dynamic-link/${dynamicId}`;

    // Check if Clipboard API is available, otherwise use the fallback
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(dynamicLink)
        .then(() => {
          console.log("Link copied to clipboard:", dynamicLink);
        })
        .catch((err) => {
          console.error(
            "Failed to copy link to clipboard. Using fallback method:",
            err
          );
          unsecuredCopyToClipboard(dynamicLink);
        });
    } else {
      console.log("Clipboard API not available. Using fallback method.");
      unsecuredCopyToClipboard(dynamicLink);
    }
  } else {
    console.error("No appointment selected to copy the link.");
  }
};

onMounted(async () => {
  await getAllAppointmentsByUserID();
});
</script>

<style>
body {
  background-color: var(--primary-bg-color);
  /* color: var(--primary-text-color); */
  color: var(--button-text-color);
}

/* General adjustments for flex containers and card display */
.flex-container {
  display: flex;
  justify-content: space-between;
}

.flex-item {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1rem;
}

/* Style adjustments specific to card layouts within QTable */
.custom-table .q-table__middle {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  padding: 16px;
}

.my-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 280px;
  /* Keeps card height uniform */
  cursor: pointer;
  border-radius: 8px;
  box-shadow: var(--q-shadow);
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
  overflow: hidden;
  margin-bottom: 16px;
  width: calc(100vw - 40px);
  /* Adjust card width to be viewport width minus 40px */
  max-width: 410px; /* Optional: max-width to ensure cards don't get too wide on large screens */
  margin: 20px auto; /* Center the card with automatic margins and provide some space around it */

  border: 2px solid transparent; /* Transparent border by default */
  transition: border-color 0.25s;

  .separator {
    background-color: var(--primary-bg-color);
  }
}

/* Icon style needed for the cards */
.q-icon {
  margin-right: 8px;
  /* color: var(--accent-color); */
  color: var(--primary-text-color);
}

/* Highlighting selected cards */
.selected-card {
  /* border: 2px solid var(--accent-color); Highlight border for selected cards */
  border-color: var(--accent-color);
  .separator {
    /* color: white; */
    transition-property: background-color;
    transition-duration: 0.25s;
    transition-timing-function: linear;
    transition-delay: 0.25s;
    background-color: var(--accent-color);
    height: 2px;
  }
}

/* Button spacing within card actions */
.btn-open,
.btn-edit,
.btn-copy,
.btn-share,
.btn-mail,
.btn-delete {
  /* margin: 0 0px; */
  margin-bottom: 2px;
  /* margin-top: 0px; */
  transform: scale(0.9);
}

.btn-new {
  color: var(--button-text-color);
  background-color: var(--primary-bg-color);
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999;
}

.btn-new:hover {
  /* color: var(--primary-text-color); */
  background-color: var(--accent-color);
}

.card-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-container {
  display: flex;
  justify-content: space-around; /* Adjusted for even spacing around items */
  align-items: center;
  gap: 0px;
  width: 100%;
  flex-wrap: wrap;
  margin-bottom: 6px;
}

/* Responsive design adjustments for action buttons in smaller viewports */
@media (max-width: 360px) {
  .my-card {
    width: calc(
      100vw - 30px
    ); /* Slightly larger cards on smaller screens if desired */
  }
}

.q-card {
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

/**
* Share button stuff
*/

.q-card__actions .share {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  margin: 5px;
  color: #fff; /* Default text color, will be overridden */
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* Icon and text styling */
.share-network i {
  margin-right: 20px;
}
.share-network span {
  font-weight: bold;
}

.q-card__actions a {
  text-decoration: none;
  color: inherit;
}

.q-card__actions a i {
  margin-right: 8px;
}
</style>
