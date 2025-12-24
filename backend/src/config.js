/**
 * Azure Services Configuration
 * 
 * This file initializes and exports Azure Cosmos DB and Blob Storage clients.
 * It uses environment variables for credentials (no hardcoding).
 * 
 * Environment Variables Needed:
 * - COSMOS_ENDPOINT: Azure Cosmos DB endpoint URL
 * - COSMOS_KEY: Azure Cosmos DB primary key
 * - COSMOS_DB_NAME: Database name (e.g., "file-notes-db")
 * - COSMOS_CONTAINER_NAME: Container name (e.g., "files")
 * - AZURE_STORAGE_CONNECTION_STRING: Blob Storage connection string
 * - CONTAINER_NAME: Blob container name (e.g., "files")
 */

const { CosmosClient } = require("@azure/cosmos");
const { BlobServiceClient } = require("@azure/storage-blob");

// ========================================
// COSMOS DB CLIENT INITIALIZATION
// ========================================

const cosmosEndpoint = process.env.COSMOS_ENDPOINT;
const cosmosKey = process.env.COSMOS_KEY;
const dbName = process.env.COSMOS_DB_NAME || "file-notes-db";
const containerName = process.env.COSMOS_CONTAINER_NAME || "files";

// Initialize Cosmos DB Client (only if credentials are available)
let cosmosClient, database, container;

if (cosmosEndpoint && cosmosKey) {
  try {
    cosmosClient = new CosmosClient({
      endpoint: cosmosEndpoint,
      key: cosmosKey,
    });
    // Reference to database and container (don't create here, should exist)
    database = cosmosClient.database(dbName);
    container = database.container(containerName);
    console.log("✅ Cosmos DB client initialized");
  } catch (err) {
    console.warn("⚠️ Cosmos DB initialization error:", err.message);
    cosmosClient = null;
    database = null;
    container = null;
  }
} else {
  console.warn("⚠️ Cosmos DB credentials not found in environment variables");
  console.warn("   COSMOS_ENDPOINT:", cosmosEndpoint ? "set" : "NOT SET");
  console.warn("   COSMOS_KEY:", cosmosKey ? "set" : "NOT SET");
  cosmosClient = null;
  database = null;
  container = null;
}

// ========================================
// BLOB STORAGE CLIENT INITIALIZATION
// ========================================

const blobConnectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const blobContainerName = process.env.CONTAINER_NAME || "files";

// Initialize Blob Service Client (only if credentials are available)
let blobServiceClient, blobContainer;

if (blobConnectionString) {
  try {
    blobServiceClient = BlobServiceClient.fromConnectionString(
      blobConnectionString
    );
    // Reference to blob container
    blobContainer = blobServiceClient.getContainerClient(blobContainerName);
    console.log("✅ Blob Storage client initialized");
  } catch (err) {
    console.warn("⚠️ Blob Storage initialization error:", err.message);
    blobServiceClient = null;
    blobContainer = null;
  }
} else {
  console.warn("⚠️ Blob Storage connection string not found in environment variables");
  console.warn("   AZURE_STORAGE_CONNECTION_STRING:", blobConnectionString ? "set" : "NOT SET");
  blobServiceClient = null;
  blobContainer = null;
}

// ========================================
// VERIFY CONNECTIONS (Optional - for debugging)
// ========================================

async function verifyConnections() {
  try {
    console.log("Verifying Azure connections...");
    
    // Test Cosmos DB
    try {
      const { resources: databases } = await cosmosClient.databases.readAll().fetchAll();
      console.log("✅ Cosmos DB connected successfully");
    } catch (cosmosError) {
      console.warn("⚠️ Cosmos DB connection warning:", cosmosError.message);
    }
    
    // Test Blob Storage
    try {
      const properties = await blobContainer.getProperties();
      console.log("✅ Blob Storage connected successfully");
    } catch (blobError) {
      console.warn("⚠️ Blob Storage connection warning:", blobError.message);
    }
    
    return true;
  } catch (error) {
    console.warn("⚠️ Connection verification had warnings:", error.message);
    // Don't throw - let the app start even if connections have issues
    return false;
  }
}

// ========================================
// EXPORTS
// ========================================

module.exports = {
  cosmosClient,
  database,
  container,
  blobServiceClient,
  blobContainer,
  verifyConnections,
};
