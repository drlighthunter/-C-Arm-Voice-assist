import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Mock API for Raspberry Pi GPIO control
  // In a real scenario, this would use a library like 'rpi-gpio' or talk to a Python script
  app.post("/api/machine/control", express.json(), (req, res) => {
    const { action, value } = req.body;
    console.log(`[PI-GPIO] Executing ${action} with value ${value}`);
    
    // Simulate hardware latency
    setTimeout(() => {
      res.json({ status: "success", action, value });
    }, 100);
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", hardware: "simulated" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
