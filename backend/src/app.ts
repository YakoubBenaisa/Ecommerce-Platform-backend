import express, { Application } from "express";
import routes from "./routes";
import { container } from "tsyringe";

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());



// Register routes
app.use("/api/v1", routes);



// Handle 404 - Route not found
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});








// Start the server
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
