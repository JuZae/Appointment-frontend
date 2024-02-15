<template>
  <q-page class="flex flex-center">
    <div v-if="verified">Your account has been successfully verified.</div>
    <div v-else-if="verificationAttempted">
      Verification failed. <q-btn label="Try again" @click="verifyAccount" />
    </div>
    <div v-else>Verifying your account...</div>
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

// Adjusted for environment variable

const verifyAccount = async () => {
  const token = route.query.token; // Accessing token from query parameters
  if (token) {
    try {
      const response = await fetch(
        `${BACKEND_BASE_URL}api/auth/verify?token=${token}`
      );
      if (response.ok) {
        verified.value = true;
        // Optionally, redirect to login page after verification
        setTimeout(() => {
          router.push("/login");
        }, 5000);
      } else {
        verificationAttempted.value = true;
        // Handle failed verification case
      }
    } catch (error) {
      console.error("Verification failed:", error);
      verificationAttempted.value = true;
    }
  } else {
    // Handle case where token is missing
    verificationAttempted.value = true;
  }
};

onMounted(() => {
  verifyAccount();
});
</script>
