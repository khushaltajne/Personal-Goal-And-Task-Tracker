import axios from "axios";

async function test() {
  try {
    console.log("Attempting login...");
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;
    console.log("Login successful, token obtained.");

    console.log("Attempting to fetch yearly goals...");
    try {
        const res = await axios.get("http://localhost:8080/api/yearly-goals", {
            headers: { Authorization: `Bearer ${token}` },
            params: { year: 2026 }
        });
        console.log("Yearly Goals:", res.data);
    } catch (err) {
        if (err.response) {
            console.log("Yearly Goals GET error:", err.response.status, err.response.data);
        } else {
            console.log("Yearly Goals GET error:", err.message);
        }
    }

    console.log("Attempting to fetch tasks (as control)...");
    try {
        const resTasks = await axios.get("http://localhost:8080/api/tasks", {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Tasks:", resTasks.data?.content?.length || resTasks.data?.length, "items found.");
    } catch (err) {
        if (err.response) {
            console.log("Tasks GET error:", err.response.status, err.response.data);
        } else {
            console.log("Tasks GET error:", err.message);
        }
    }

  } catch (err) {
    if (err.response) {
      console.log("Login error:", err.response.status, err.response.data);
    } else {
      console.log("Error:", err.message);
    }
  }
}
test();
