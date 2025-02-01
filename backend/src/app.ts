import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import routes from "./routes";


const app: Application = express();


// Middleware to parse JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", routes);





// Handle 404 - Route not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: "Route not found"
  });
});

// Start the server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
