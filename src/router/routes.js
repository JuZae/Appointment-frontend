const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "/overviewpage",
        component: () => import("pages/eventhandling/OverviewPage.vue"),
      },
      {
        path: "/addEvent",
        component: () => import("pages/eventhandling/AddEvent.vue"),
      },

      { path: "/login", component: () => import("pages/login/LoginPage.vue") },
      {
        path: "/registration",
        component: () => import("pages/login/RegistrationPage.vue"),
      },

      {
        path: "/event",
        component: () => import("pages/dynamic/EventPage.vue"),
      },
      {
        path: "/dynamic-link/:appointmentId",
        component: () => import("pages/dynamic/DynamicLink.vue"),
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
