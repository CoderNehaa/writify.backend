import express, { Application, Router } from "express";
import mongoose from "mongoose";
import { DB_CONNECTION_URL } from "./config/environment";
import cookieParser from "cookie-parser";
import GlobalErrorHandler from "./middlewares/errorHandler.middleware";

interface RouteDefinition {
  path: string;
  router: Router;
}

class App {
  express: Application;
  port: number;

  constructor(port: number, routes: RouteDefinition[]) {
    this.express = express();
    this.port = port;

    // Initialize DB connection, middlewares, routes and global error handler
    this.initializeDBConnection();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  initializeDBConnection() {
    mongoose
      .connect(DB_CONNECTION_URL)
      .then((mongooseInstance) => {
        console.log("DB Connected successfully!");
        return mongooseInstance;
      })
      .catch((error) => {
        console.log("Failed to connect DB:", error);
        throw error;
      });
  }

  initializeMiddlewares() {
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(cookieParser());
  }

  initializeRoutes(routes: RouteDefinition[]) {
    routes.forEach((route) => {
      this.express.use(`/api/${route.path}`, route.router);
    });
  }

  initializeErrorHandling() {
    this.express.use(GlobalErrorHandler);
  }

  listen() {
    this.express.listen(this.port, () => {
      console.log("App listening on port", this.port);
    });
  }
}

export default App;
