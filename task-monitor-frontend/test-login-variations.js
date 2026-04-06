import axios from "axios";
import { jwtDecode } from "jwt-decode";

async function test() {
  try {
    console.log("Attempting login with USERNAME instead of email key...");
    // Some backends use 'username' field for credentials even if it's an email
    // Or maybe it actually wants the username "testuser22"
    const credentials = [
        { email: "testuser22@example.com", password: "password" },
        { username: "testuser22", password: "password" },
        { email: "testuser22", password: "password" }
    ];

    for (const cred of credentials) {
        try {
            console.log(`Trying credentials: ${JSON.stringify(cred)}`);
            const res = await axios.post("http://localhost:8080/api/auth/login", cred);
            const token = res.data.accessToken;
            console.log("Login Success!");
            const decoded = jwtDecode(token);
            console.log("Decoded:", JSON.stringify(decoded, null, 2));
            
            // Try to hit /api/auth/me
            try {
                const me = await axios.get("http://localhost:8080/api/auth/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Me Status:", me.status);
            } catch (e) {
                console.log("Me Status:", e.response?.status);
            }
        } catch (err) {
            console.log("Login Failed:", err.response?.status);
        }
        console.log("---");
    }

  } catch (err) {
      console.log("Process failed:", err.message);
  }
}
test();
