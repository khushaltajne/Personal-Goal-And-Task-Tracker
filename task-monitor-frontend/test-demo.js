import axios from "axios";

async function test() {
  try {
    console.log("Attempting login with DEMO credentials...");
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "demo@example.com",
      password: "password123"
    });
    const token = regRes.data.accessToken;
    console.log("Demo Login successful.");

    try {
        const statsRes = await axios.get("http://localhost:8080/api/dashboard", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Dashboard status with Demo:", statsRes.status);
    } catch (err) {
        console.log("Dashboard Error status with Demo:", err.response?.status);
    }

    try {
        const yearlyRes = await axios.get("http://localhost:8080/api/yearly-goals", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Yearly Goals status with Demo:", yearlyRes.status);
    } catch (err) {
        console.log("Yearly Goals Error status with Demo:", err.response?.status);
    }

  } catch (err) {
      console.log("Demo Login failed:", err.response?.status);
  }
}
test();
