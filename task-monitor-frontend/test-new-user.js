import axios from "axios";
import { jwtDecode } from "jwt-decode";

async function test() {
  const rand = Math.floor(Math.random() * 10000);
  const email = `testuser${rand}@example.com`;
  const username = `testuser${rand}`;
  
  try {
    console.log(`Registering ${email}...`);
    const regRes = await axios.post("http://localhost:8080/api/auth/register", {
      username: username,
      password: "password",
      email: email
    });
    console.log("Registered.");

    console.log("Logging in...");
    const loginRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: email,
      password: "password"
    });
    const token = loginRes.data.accessToken;
    console.log("Login successful.");

    const decoded = jwtDecode(token);
    console.log("Decoded Payload:", JSON.stringify(decoded, null, 2));

    try {
        const meRes = await axios.get("http://localhost:8080/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Me status:", meRes.status);
    } catch (err) {
        console.log("Me status:", err.response?.status);
    }

  } catch (err) {
      console.log("Process failed:", err.response?.status, err.response?.data);
  }
}
test();
