import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;

    try {
      const statsRes = await axios.get("http://localhost:8080/api/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Dashboard response:", statsRes.status);
    } catch(e) {
      console.log("Dashboard Error status:", e.response?.status);
    }
    
    try {
      const tasksRes = await axios.get("http://localhost:8080/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Tasks response:", tasksRes.status);
    } catch(e) {
      console.log("Tasks Error status:", e.response?.status);
    }
    
    try {
      const yearlyRes = await axios.get("http://localhost:8080/api/yearly-goals", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Yearly response:", yearlyRes.status);
    } catch(e) {
      console.log("Yearly Error status:", e.response?.status);
    }
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
    } else {
      console.log(err);
    }
  }
}
test();
