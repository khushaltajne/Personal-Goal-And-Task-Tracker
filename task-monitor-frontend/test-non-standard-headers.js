import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;
    console.log("Login successful.");

    const headers = [
        { name: "Authorization Bearer", headers: { Authorization: `Bearer ${token}` } },
        { name: "x-access-token", headers: { 'x-access-token': token } },
        { name: "x-auth-token", headers: { 'x-auth-token': token } },
        { name: "token", headers: { 'token': token } },
        { name: "token (Bearer)", headers: { 'token': `Bearer ${token}` } }
    ];

    for (const h of headers) {
        try {
            const res = await axios.get("http://localhost:8080/api/auth/me", {
                headers: h.headers
            });
            console.log(`Success with ${h.name}:`, res.status);
        } catch (err) {
            console.log(`Failed with ${h.name}:`, err.response?.status || err.message);
        }
    }
  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
