import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;

    const res = await axios.get("http://localhost:8080/api/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Tasks:", res.data);
  } catch (err) {
    if (err.response) {
      console.log("Tasks GET error:", err.response.status, err.response.data);
      console.log("Headers:", err.response.headers);
    } else {
      console.log(err);
    }
  }
}
test();
