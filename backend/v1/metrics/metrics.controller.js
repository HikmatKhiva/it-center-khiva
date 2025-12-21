import { io } from "../../app.js";
import { getSystemInfo } from "./metrics.helper.js";
async function getMetrics(req, res) {
  try {
    const result = await getSystemInfo();
    io.emit("metrics", result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get metrics" });
  }
}

export { getMetrics };
