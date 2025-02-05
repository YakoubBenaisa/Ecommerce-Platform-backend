import "reflect-metadata";
import express, { Application, Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import routes from "./routes";
import { container } from "./config/container";
import ResponseUtils from "./utils/response.utils";
import GlobalErrorHandler from "./middlewares/errors.middlware";
import listEndpoints from "express-list-endpoints";

const app: Application = express();

// Middleware to parse JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", routes);

// ======================
// 404 Handler
// ======================
app.use("*", (req, res, next) => {
  const responseUtils = container.resolve(ResponseUtils);
  responseUtils.sendNotFoundResponse(res, "Endpoint not found");
});

// ======================
// Global Error Handler
// ======================
const globalErrorHandler = container.resolve(GlobalErrorHandler);
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    globalErrorHandler.handle(err, req, res, next);
  },
);

// routes list
//console.log(listEndpoints(app));

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
