import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/register", {
      username: "testuser22",
      password: "password",
      email: "testuser22@example.com"
    });
    console.log("Registered:", regRes.data);
    const token = regRes.data.accessToken;

    const tasksRes = await axios.get("http://localhost:8080/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Tasks response:", tasksRes.status);
  } catch (err) {
    if (err.response) {
      console.log("Error status:", err.response.status);
      console.log("Error data:", err.response.data);
    } else {
      console.log(err);
    }
  }
}
test();
