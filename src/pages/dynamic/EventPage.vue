<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-form @submit="sendEmail">
          <!-- <q-input
            v-model="recipient"
            label="Recipient Email"
            type="email"
            outlined
            dense
            required
            filled
            class="custom-q-input"
          /> -->
          <q-select
            filled
            outlined
            label="Recipients"
            v-model="recipient"
            use-input
            use-chips
            multiple
            hide-dropdown-icon
            input-debounce="0"
            new-value-mode="add"
            class="custom-q-select"
            placeholder="Enter recipient emails"
          />
          <q-input
            v-model="subject"
            label="Subject"
            outlined
            dense
            required
            filled
            class="custom-q-input"
          />
          <!-- <q-input
            type="textarea"
            v-model="body"
            label="Email Body"
            outlined
            readonly
            dense
          /> -->
          <q-editor v-model="body" min-height="100px" />
          <div>
            <q-btn label="Send Email" type="submit" class="q-mt-md" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted, inject } from "vue";
import { useRoute } from "vue-router";
import AuthStore from "src/stores/authStore";

const route = useRoute();

const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

const authStore = AuthStore.useStore();

const appointmentId = route.params.appointmentId;

const recipient = ref(null);
const subject = ref("");
const body = ref(``);

//Authentication stuff
const jwtToken = authStore.token; //JWT Token (if exists)
// Create the authorization header
const headers = {
  Authorization: `Bearer ${jwtToken}`,
  "Content-Type": "application/json",
  Accept: "application/json", // You can include other headers as needed
};

const sendEmail = async (event) => {
  event.preventDefault();

  const emailData = {
    to: recipient.value,
    subject: subject.value,
    body: body.value,
  };

  const URL_EMAIL = BACKEND_BASE_URL + "email/sendEmail";
  try {
    const response = await fetch(URL_EMAIL, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }

    const responseData = await response.json();
    console.log("Response Data:", responseData);
  } catch (error) {
    //Email could not get sent (either invalid or server side Problem)
    console.error("Error:", error.message);
  }
};

const fetchAppointment = async (appointmentId) => {
  const API_GET_APP = BACKEND_BASE_URL + "api/app/getAppById/" + appointmentId;
  // Fetch appointment details from backend and populate appointmentData
  try {
    const response = await fetch(API_GET_APP, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
    }
    const responseData = await response.json();
    const appointment = responseData;

    if (responseData) {
      appointment.value = responseData;
      subject.value = `Einladung: ${appointment.bez}`;
      body.value = `
    <html>
    <body>
      <p>Du wurdest zu einer Veranstaltung in ${appointment.ort} eingeladen.</p>
      <p>Mögliche Termine hierfür findest du unter folgendem Link: 
        <a href="${window.location.origin}/dynamic-link/${appointment.id}">
          Terminabstimmung
        </a>.
      </p>
      <p>Beschreibung der Veranstaltung: ${appointment.beschreibung}</p>
    </body>
    </html>
  `;
    }
  } catch (error) {
    console.error("Error fetching appointment:", error);
  }
};

onMounted(async () => {
  if (appointmentId) {
    await fetchAppointment(appointmentId);
  }
});
</script>

<style>
.q-card {
  background-color: var(--secondary-bg-color);
  color: var(--primary-text-color);
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

.q-editor {
  background-color: var(--secondary-bg-color);
  color: var(--primary-text-color);
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
</style>
