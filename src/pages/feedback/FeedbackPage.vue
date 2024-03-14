<template>
  <h3>Feedback</h3>
  <div class="flex-container">
    <div class="flex-item">
      <q-btn
        id="send"
        fab
        icon="send"
        no-caps
        href="https://github.com/JuZae/Appointment-frontend/issues"
        >Feedback abgeben</q-btn
      >
    </div>
  </div>
</template>

<style>
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

h3 {
  padding-left: 20px;
}
</style>
