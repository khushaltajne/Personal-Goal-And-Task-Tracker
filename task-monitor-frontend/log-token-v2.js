import axios from "axios";
import { jwtDecode } from "jwt-decode";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const rawToken = regRes.data.accessToken;
    console.log("Token obtained.");
    
    try {
        const decoded = jwtDecode(rawToken);
        console.log("Decoded Payload:", JSON.stringify(decoded, null, 2));
    } catch (e) {
        console.log("JWT Decode failed:", e.message);
    }

  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
