const express = require("express");
const mongoose = require("mongoose");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoute");
const foodRoutes = require("./routes/foodRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");

const uri =
  "mongodb+srv://new-user-31:BVjbKBhcu8puOKC3@cluster19986.4ktj0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster19986";

// Create Express ap
const app = express();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

// Routes
app.use("/api", userRoutes);
app.use("/api", itemRoutes);
app.use("/api", categoryRoutes);
app.use("/api", foodRoutes);
app.use("/api", uploadRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // This will serve your Swagger docs at /api-docs
app.use("/uploads", express.static(path.join(__dirname, "routes", "uploads")));
