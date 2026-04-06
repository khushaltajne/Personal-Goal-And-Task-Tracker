import axios from "axios";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const rawToken = regRes.data.accessToken;
    console.log("Token type:", typeof rawToken);
    console.log("Token length:", rawToken.length);
    console.log("Token starts with:", rawToken.substring(0, 10));
    console.log("Token ends with:", rawToken.substring(rawToken.length - 10));
    
    // Check for quotes
    if (rawToken.startsWith('"') && rawToken.endsWith('"')) {
        console.log("CRITICAL: Token contains wrapped quotes!");
    } else if (rawToken.includes('"')) {
        console.log("CRITICAL: Token contains quotes!");
    } else {
        console.log("Token looks like a clean string.");
    }

  } catch (err) {
      console.log("Login failed:", err.response?.status);
  }
}
test();
