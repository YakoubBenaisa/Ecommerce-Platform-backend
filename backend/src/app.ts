import express, { Application } from "express";
import routes from "./routes";

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());



// Register routes
app.use("/api/v1", routes);



// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
