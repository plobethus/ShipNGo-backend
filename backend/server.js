/* 
 * /ShipNGo/backend/server.js
 * Main server file using raw Node.js (no Express). 
 * Updated to verify JWT for /packages/customer (and /packages/dashboard/employee) 
 * so the backend returns JSON errors instead of fallback HTML if auth fails.
 */

const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const { serveFile, verifyToken } = require("./helpers");

// Import route modules
const authRoutes = require("./routes/auth");
const claimsRoutes = require("./routes/claims");
const deliverpointsRoutes = require("./routes/deliverpoints");
const packageRoutes = require("./routes/packageRoutes");
const shipmentRoutes = require("./routes/shipment");
const trackingRoutes = require("./routes/tracking");

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // ---- /auth endpoints ----
    if (pathname.startsWith("/auth")) {
      if (req.method === "POST" && pathname === "/auth/login") {
        await authRoutes.login(req, res);
        return;
      } else if (req.method === "POST" && pathname === "/auth/register") {
        await authRoutes.register(req, res);
        return;
      } else if (req.method === "GET" && pathname === "/auth/me") {
        await authRoutes.authMe(req, res);
        return;
      } else if (
        req.method === "GET" &&
        (pathname === "/auth/dashboard/customer" || pathname === "/auth/dashboard/employee")
      ) {
        authRoutes.serveDashboard(req, res);
        return;
      }
    }

    // ---- /claims endpoints ----
    else if (pathname.startsWith("/claims")) {
      if (req.method === "GET" && pathname === "/claims") {
        await claimsRoutes.getClaims(req, res);
        return;
      } else if (req.method === "POST" && pathname === "/claims") {
        await claimsRoutes.fileClaim(req, res);
        return;
      }
    }

    // ---- /edit (delivery points) endpoints ----
    else if (pathname.startsWith("/edit")) {
      if (req.method === "PUT" && pathname === "/edit/update_delivery_point_address") {
        await deliverpointsRoutes.updateDeliveryPointAddress(req, res);
        return;
      } else if (req.method === "PUT" && pathname === "/edit/register_delivery_point") {
        await deliverpointsRoutes.registerDeliveryPoint(req, res);
        return;
      }
    }

    // ---- /packages endpoints ----
    else if (pathname.startsWith("/packages")) {
      // e.g. GET /packages/dashboard/employee
      if (req.method === "GET" && pathname === "/packages/dashboard/employee") {
        // 1) Verify JWT
        const tokenData = verifyToken(req);
        if (!tokenData) {
          // Return JSON error instead of fallback HTML
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Unauthorized. No valid token for employee route." }));
          return;
        }
        // Attach tokenData for the route to see
        req.tokenData = tokenData;
        // 2) Call route handler
        await packageRoutes.getPackagesEmployee(req, res, parsedUrl.query);
        return;
      }
      // e.g. PUT /packages/123
      else if (req.method === "PUT" && pathname.startsWith("/packages/")) {
        const parts = pathname.split("/");
        const id = parts[2];
        // Possibly verify token as well if needed
        await packageRoutes.updatePackage(req, res, id);
        return;
      }
      // e.g. GET /packages/customer
      else if (req.method === "GET" && pathname === "/packages/customer") {
        // 1) Verify JWT
        const tokenData = verifyToken(req);
        if (!tokenData) {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Unauthorized. No valid token for customer route." }));
          return;
        }
        // Attach tokenData
        req.tokenData = tokenData;
        // 2) Call route
        await packageRoutes.getPackagesCustomer(req, res);
        return;
      }
    }

    // ---- /shipment endpoints ----
    else if (pathname.startsWith("/shipment")) {
      if (req.method === "POST" && pathname === "/shipment") {
        await shipmentRoutes.createShipment(req, res);
        return;
      } else if (req.method === "GET" && pathname === "/shipment") {
        await shipmentRoutes.getShipments(req, res);
        return;
      } else if (req.method === "GET" && pathname.startsWith("/shipment/")) {
        const parts = pathname.split("/");
        const id = parts[2];
        await shipmentRoutes.getShipmentById(req, res, id);
        return;
      }
    }

    // ---- /tracking endpoints ----
    else if (pathname.startsWith("/tracking")) {
      if (req.method === "GET" && pathname.startsWith("/tracking/")) {
        const parts = pathname.split("/");
        const trackingId = parts[2];
        await trackingRoutes.getTracking(req, res, trackingId);
        return;
      } else if (req.method === "POST" && pathname === "/tracking") {
        await trackingRoutes.updateTracking(req, res);
        return;
      }
    }

    // If no API route matches, try to serve a static file from the frontend folder.
    const filePath = path.join(__dirname, "../frontend", pathname);
    fs.stat(filePath, (err, stats) => {
      if (!err && stats.isFile()) {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end("Server error");
          } else {
            res.writeHead(200);
            res.end(data);
          }
        });
      } else {
        // Fallback: serve index.html for Single Page Application (SPA)
        const indexFile = path.join(__dirname, "../frontend/index.html");
        fs.readFile(indexFile, (err, data) => {
          if (err) {
            res.statusCode = 500;
            res.end("Server error");
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
          }
        });
      }
    });
  } catch (error) {
    res.statusCode = 500;
    res.end("Server error: " + error.message);
  }
});

// Start server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});