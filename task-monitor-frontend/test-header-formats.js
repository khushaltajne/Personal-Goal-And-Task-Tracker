import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;
    console.log("Login successful.");

    const formats = [
        { name: "Bearer prefix (Standard)", header: `Bearer ${token}` },
        { name: "No prefix", header: token },
        { name: "bearer lowercase", header: `bearer ${token}` },
    ];

    for (const format of formats) {
        try {
            const res = await axios.get("http://localhost:8080/api/auth/me", {
                headers: { Authorization: format.header }
            });
            console.log(`Success with ${format.name}:`, res.status);
        } catch (err) {
            console.log(`Failed with ${format.name}:`, err.response?.status || err.message);
        }
    }
  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
