const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/login",
        component: () => import("pages/login/TestLoginPage.vue"),
      },
      {
        path: "/register",
        component: () => import("pages/login/TestRegisterPage.vue"),
      },
      {
        path: "/overviewpage",
        component: () => import("pages/eventhandling/OverviewPage.vue"),
      },
      {
        path: "/addEvent",
        component: () => import("pages/eventhandling/AddEvent.vue"),
      },

      // { path: "/login", component: () => import("pages/login/LoginPage.vue") },
      {
        path: "/registration",
        component: () => import("pages/login/RegistrationPage.vue"),
      },
      {
        path: "/mailevent",
        component: () => import("pages/dynamic/EventPage.vue"),
      },
      {
        path: "/google",
        component: () => import("pages/test/TestRegistration.vue"),
      },
      {
        path: "/dynamic-link/:appointmentId",
        component: () => import("pages/dynamic/DynamicLink.vue"),
      },
      {
        path: "/signIn",
        component: () => import("pages/login/SignInPage.vue"),
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
