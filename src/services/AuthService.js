// export default {
//   async login(email, password) {
//     const response = await fetch("http://localhost:8080/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     if (!response.ok) {
//       throw new Error("Login failed");
//     }
//     return response.json();
//   },

//   logout() {
//     localStorage.removeItem("userToken");
//   },
// };
