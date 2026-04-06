import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;
    console.log("Login successful.");

    try {
        const meRes = await axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Current User:", JSON.stringify(meRes.data, null, 2));
    } catch (err) {
        console.log("Me Error status:", err.response?.status, err.response?.data);
    }
  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
