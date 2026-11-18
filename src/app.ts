import express from "express";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
import itemRoutes from "./api/v1/routes/itemRoutes";
import userRoutes from "./api/v1/routes/userRoutes"; // Import user routes
import adminRoutes from "./api/v1/routes/adminRoutes";

const app = express();

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

// Body parsing middleware
app.use(express.json());

app.get("/", (_req, res) => {
    res.status(200).send("Hello World");
});

app.get("/api/v1/health", (_req, res) => {
    res.status(200).json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

// API Routes
app.use("/api/v1/items", itemRoutes);

// Mount the user routes under /users
app.use("/api/v1/users", userRoutes);

// Mount the admin routes under /admin
app.use("/api/v1/admin", adminRoutes);

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

export default app;