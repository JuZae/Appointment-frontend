const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "/",
        component: () => import("pages/LandingPage.vue"),
        name: "landingPage",
      },
      {
        path: "/login",
        component: () => import("pages/login/TestLoginPage.vue"),
        name: "loginPage",
      },
      {
        path: "/register",
        component: () => import("pages/login/TestRegisterPage.vue"),
        name: "registerPage",
      },
      {
        path: "/overviewpage",
        component: () => import("pages/eventhandling/OverviewPage.vue"),
        name: "overviewPage",
      },
      {
        path: "/addEvent",
        component: () => import("pages/eventhandling/AddEvent.vue"),
        name: "addEvent",
      },

      // { path: "/login", component: () => import("pages/login/LoginPage.vue") },
      // {
      //   path: "/registration",
      //   component: () => import("pages/login/RegistrationPage.vue"),
      // },
      {
        path: "/mailevent",
        component: () => import("pages/dynamic/EventPage.vue"),
        name: "mailPage",
      },
      // {
      //   path: "/google",
      //   component: () => import("pages/test/TestRegistration.vue"),
      // },
      {
        path: "/dynamic-link/:appointmentId",
        component: () => import("pages/dynamic/DynamicLink.vue"),
      },
      {
        path: "/editAppointment/:appointmentId",
        component: () => import("pages/eventhandling/EditAppointment.vue"),
        name: "editAppointment",
      },
      {
        path: "/feedback",
        component: () => import("pages/feedback/FeedbackPage.vue"),
        name: "feedback",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/error/ErrorNotFound.vue"),
  },
];

export default routes;
