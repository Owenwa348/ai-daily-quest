import "dotenv/config";   // 🔥 บรรทัดนี้ต้องอยู่บนสุด

import app from "./app";
import { initDB } from "./database";

async function startServer() {
  // 🔥 WAIT for DB tables creation
  await initDB();

  app.listen(3001, () => {
    console.log("🔥 Express running on 3001");
  });
}

startServer();
