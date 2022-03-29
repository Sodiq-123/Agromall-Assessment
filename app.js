const express = require("express");
const app = express();
const adminRouter = require("./src/routes/admin.routes");
const employeeRouter = require("./src/routes/employee.routes");

module.exports = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Specify routes
  app.use("/api/admin", adminRouter);
  app.use("/api/employees", employeeRouter);
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: "Not found",
    });
  });

  // error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err,
    });
  });

  return app;
};
