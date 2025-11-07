import app from "./app.js";
import dotenv from "dotenv";
import http from "http";
dotenv.config();
const server = http.createServer(app);
server.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port:", process.env.PORT || 3000);
});
