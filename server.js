import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createServer } from "http";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the "public" directory
app.use(express.static(join(__dirname, "public")));

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "public", "index.html"));
});

// Serve the tailwind test file
app.get("/tailwind-test", (req, res) => {
  res.sendFile(join(__dirname, "public", "tailwind-test.html"));
});

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(
    `Tailwind test page: http://localhost:${PORT}/tailwind-test.html`
  );
});
