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
          <textarea v-model="body" label="Email Body" outlined dense required />
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
import { ref } from "vue";

const recipient = ref("");
const subject = ref("");
const body = ref("");

const sendEmail = async (event) => {
  event.preventDefault();

  const emailData = {
    to: recipient.value.trim(),
    subject: subject.value,
    body: body.value,
  };

  try {
    const response = await fetch("http://localhost:8080/sendEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
</script>
