import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;
    console.log("Login successful.");

    const endpoints = [
        "/api/v1/yearly-goals",
        "/api/v1/tasks",
        "/api/v1/dashboard"
    ];

    for (const ep of endpoints) {
        try {
            const res = await axios.get(`http://localhost:8080${ep}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Success with ${ep}:`, res.status);
        } catch (err) {
            console.log(`Failed with ${ep}:`, err.response?.status || err.message);
        }
    }
  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
