<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-form @submit="sendEmail">
          <q-input
            v-model="recipient"
            label="Recipient Email"
            type="email"
            outlined
            dense
            required
          />
          <q-input v-model="subject" label="Subject" outlined dense required />
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
            <q-btn
              label="Send Email"
              color="primary"
              type="submit"
              class="q-mt-md"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import AuthStore from "src/stores/authStore";

const route = useRoute();

const authStore = AuthStore.useStore();

const appointmentId = route.params.appointmentId;

const recipient = ref("");
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
    to: recipient.value.trim(),
    subject: subject.value,
    body: body.value,
  };

  const URL_EMAIL = "http://49.13.170.189:8080/" + "email/sendEmail";
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
  const API_GET_APP =
    "http://49.13.170.189:8080/" + "api/app/getAppById/" + appointmentId;
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
        <a href="http://49.13.170.189:9000/dynamic-link/${appointment.id}">
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
