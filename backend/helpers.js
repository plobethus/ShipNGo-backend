/* 
*   ShipNGo/backend/helpers.js
*/

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Read and parse JSON body from a request
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => { data += chunk; });
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", (err) => reject(err));
  });
}

// Parse cookies from request headers
function parseCookies(req) {
  const cookieHeader = req.headers.cookie;
  const cookies = {};
  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const parts = cookie.split("=");
      cookies[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }
  return cookies;
}

// Send a JSON response
function sendJson(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

// Serve a static file from disk
function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.end("Resource not found");
    } else {
      let ext = path.extname(filePath).toLowerCase();
      let contentType = "text/html";
      if (ext === ".css") contentType = "text/css";
      else if (ext === ".js") contentType = "application/javascript";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(data);
    }
  });
}

// Verify JWT token from cookies
function verifyToken(req) {
  const cookies = parseCookies(req);
  if (!cookies.token) return null;
  try {
    return jwt.verify(cookies.token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  readJsonBody,
  parseCookies,
  sendJson,
  serveFile,
  verifyToken
};