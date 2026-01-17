// IIS Node startup - simpler entry point for Azure App Service
require("dotenv").config();

const app = require("./index");

// This file acts as a bridge for IIS Node
// IIS will run this file and expect it to start the server
console.log("IIS Node: Starting via app.js...");
