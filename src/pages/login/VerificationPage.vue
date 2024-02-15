<template>
  <q-page class="verification-page">
    <q-card class="my-card q-pa-md">
      <q-card-section class="text-center">
        <div v-if="verified" class="verification-message">
          <q-icon
            name="check_circle"
            size="32px"
            class="icon-success q-mb-md"
          />
          <div class="text-h5">Account Verified!</div>
          <p class="q-mt-md">
            Congratulations! Your account has been successfully verified. You
            can now enjoy full access to all our features.
          </p>
          <q-btn
            color="positive"
            label="Proceed to Login"
            @click="goToLogin"
            class="q-mt-md"
          />
        </div>
        <div v-else-if="verificationAttempted" class="verification-message">
          <q-icon name="error" size="32px" class="icon-error q-mb-md" />
          <div class="text-h5">Verification Failed</div>
          <p class="q-mt-md">
            We were unable to verify your account. Please try again or contact
            support for assistance.
          </p>
          <q-input v-model="email" label="Email" />
          <q-btn
            color="negative"
            label="Resend Verification Email"
            @click="resendVerificationEmail"
            class="q-mt-md"
          />
        </div>
        <div v-else class="verification-message">
          <q-spinner-dots size="32px" class="q-mr-md" />
          <p>Verifying your account, please wait...</p>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, ref, inject } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const BACKEND_BASE_URL = inject("BACKEND_BASE_URL");

const verified = ref(false);
const verificationAttempted = ref(false);

const email = ref("");

const verifyAccount = async () => {
  const token = route.query.token;
  if (token) {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}api/auth/verify?token=${token}`
      );
      if (response.ok) {
        verified.value = true;
      } else {
        verificationAttempted.value = true;
      }
    } catch (error) {
      console.error("Verification failed:", error);
      verificationAttempted.value = true;
    }
  } else {
    verificationAttempted.value = true;
  }
};

const resendVerificationEmail = async () => {
  if (email.value == null) {
    email.value = localStorage.getItem("userMail");
  }
  try {
    await fetch(`${BACKEND_BASE_URL}api/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  } catch (error) {
    console.error("Failed to resend verification email:", error);
  }
};

const goToLogin = () => {
  router.push("/login");
};

onMounted(() => {
  verifyAccount();
});
</script>

<style>
.verification-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--primary-bg-color);
  color: var(--primary-text-color);
}

.my-card {
  width: 90%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  background-color: var(--secondary-bg-color);
}

.verification-message {
  padding: 20px;
}

.icon-success {
  color: var(--positive-color);
}

.icon-error {
  color: var(--negative-color);
}

@media (max-width: 600px) {
  .my-card {
    width: 95%;
    margin: 0 20px;
  }
}
</style>
