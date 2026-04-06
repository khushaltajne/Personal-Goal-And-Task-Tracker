import axios from "axios";
import { jwtDecode } from "jwt-decode";
import fs from "fs";

async function test() {
  try {
    const regRes = await axios.post("http://localhost:8080/api/auth/login", {
      email: "testuser22@example.com",
      password: "password"
    });
    const token = regRes.data.accessToken;
    fs.writeFileSync("token.json", JSON.stringify(jwtDecode(token), null, 2), "utf8");
  } catch (err) {
    console.log(err);
  }
}
test();
