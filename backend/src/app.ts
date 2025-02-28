import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes";
import webhookRoutes from "./routes/webhook.routes";
import { container } from "./config/container";
import ResponseUtils from "./utils/response.utils";
import GlobalErrorHandler from "./middlewares/errors.middlware";
import listEndpoints from "express-list-endpoints";

import { TFindInput } from "./types/types"; // Adjust path as needed


const app: Application = express();


declare module "express-serve-static-core" {
  interface Request {
    queryParams: TFindInput;
  }
}

app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", routes);
app.use("/webhook", webhookRoutes);

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Request:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    // Note: The body might be empty if not yet parsed
    body: req.body,
  });
  next();
});

// ======================
// 404 Handler
// ======================
app.use("*", (req, res, next) => {
  const responseUtils = container.resolve(ResponseUtils);
  responseUtils.sendNotFoundResponse(res, "Endpoint not found");
  next();
});

// ======================
// Global Error Handler
// ======================
const globalErrorHandler = container.resolve(GlobalErrorHandler);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  globalErrorHandler.handle(err, req, res, next);
});

// routes list
console.log(listEndpoints(app));

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
