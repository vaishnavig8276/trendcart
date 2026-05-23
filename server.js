const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// API Route
app.get("/api/products", (req, res) => {

  fs.readFile("products.json", "utf-8", (err, data) => {

    if (err) {
      return res.status(500).json({
        message: "Error reading products data"
      });
    }

    res.json(JSON.parse(data));

  });

});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});