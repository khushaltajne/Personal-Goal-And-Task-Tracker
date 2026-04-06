import axios from "axios";

async function test() {
  try {
    console.log("Testing /api/tasks via 127.0.0.1 WITHOUT token...");
    const res = await axios.get("http://127.0.0.1:8080/api/tasks");
    console.log("Success without token:", res.status);
  } catch (err) {
    if (err.response) {
        console.log("Failed without token:", err.response.status, JSON.stringify(err.response.data));
    } else {
        console.log("Failed without token:", err.message);
    }
  }
}
test();
