import { boot } from "quasar/wrappers";
import SocialSharing from "vue-social-sharing";

export default boot(async ({ app }) => {
  try {
    app.use(SocialSharing);
  } catch (error) {
    console.error("Error booting vue-social-sharing:", error);
  }
});
