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
        "/api/auth/me",
        "/api/dashboard",
        "/api/tasks",
        "/api/yearly-goals?year=2026"
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint}...`);
            const res = await axios.get(`http://localhost:8080${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`Success ${endpoint}:`, res.status);
        } catch (err) {
            if (err.response) {
                console.log(`Error ${endpoint}:`, err.response.status, JSON.stringify(err.response.data));
            } else {
                console.log(`Error ${endpoint}:`, err.message);
            }
        }
    }
  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
