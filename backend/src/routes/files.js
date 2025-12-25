/**
 * File Management Routes
 * 
 * Endpoints:
 * - GET /health - Health check
 * - POST /upload - Upload file to Azure Blob & save metadata to Cosmos DB
 * - GET / - List all files for a user
 * - GET /:id - Get specific file metadata
 * - DELETE /:id - Delete file from Blob & Cosmos DB
 */

const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { container, blobContainer } = require("../config");
const { asyncHandler } = require("../middleware/errorHandler");
const {
  validateFileUpload,
  validateFileMetadata,
  validateFileId,
  validateListQuery,
} = require("../middleware/validation");

const router = express.Router();

// Configure multer for file upload (store in memory)
const upload = multer({ storage: multer.memoryStorage() });

// ========================================
// ENDPOINT 1: GET /health
// Purpose: Health check for monitoring
// ========================================

router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "File Management API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ========================================
// ENDPOINT 2: POST /upload
// Purpose: Upload file to Azure Blob + save metadata to Cosmos DB
// ========================================

router.post(
  "/upload",
  upload.single("file"),
  validateFileMetadata,
  validateFileUpload,
  asyncHandler(async (req, res) => {
    const startTime = Date.now();
    try {
      // Check if Azure services are available
      if (!blobContainer || !container) {
        console.error("❌ [UPLOAD FAILED] Azure services not configured");
        console.error("   blobContainer:", blobContainer ? "available" : "NOT AVAILABLE");
        console.error("   cosmosDB container:", container ? "available" : "NOT AVAILABLE");
        return res.status(503).json({
          error: "Azure services not configured. Please check environment variables.",
          details: {
            blobStorage: blobContainer ? "connected" : "not connected",
            cosmosDB: container ? "connected" : "not connected",
            requiredEnv: {
              COSMOS_ENDPOINT: "required",
              COSMOS_KEY: "required",
              AZURE_STORAGE_CONNECTION_STRING: "required",
            }
          }
        });
      }

      const { userId, description, tags } = req.body;
      const file = req.file;

      // Log upload start
      console.log(`📤 [UPLOAD START] userId: ${userId}, fileName: ${file.originalname}, size: ${file.size} bytes`);

      // Generate unique file ID
      const fileId = uuidv4();

      // Create blob name (unique to avoid conflicts)
      const blobName = `${userId}/${fileId}-${file.originalname}`;

      console.log(`📝 [BLOB UPLOAD] blobName: ${blobName}`);

      // Upload to Blob Storage with timeout protection
      const blockBlobClient = blobContainer.getBlockBlobClient(blobName);
      const blobStartTime = Date.now();
      
      try {
        await Promise.race([
          blockBlobClient.upload(file.buffer, file.size, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
          }),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Blob Storage upload timeout after 25 seconds")), 25000)
          ),
        ]);
        const blobDuration = Date.now() - blobStartTime;
        console.log(`✅ [BLOB SUCCESS] blobUrl: ${blockBlobClient.url}, duration: ${blobDuration}ms`);
      } catch (blobError) {
        const blobDuration = Date.now() - blobStartTime;
        console.error(`❌ [BLOB UPLOAD FAILED] duration: ${blobDuration}ms, error: ${blobError.message}`);
        throw new Error(`Blob Storage upload failed: ${blobError.message}`);
      }

      // Create metadata document for Cosmos DB
      const fileMetadata = {
        id: fileId,
        userId: userId,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
        blobUrl: blockBlobClient.url,
        blobName: blobName,
        uploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          description: description || "",
          tags: tags ? (Array.isArray(tags) ? tags : [tags]) : [],
        },
      };

      console.log(`📊 [COSMOS SAVE] fileId: ${fileId}`);

      // Save metadata to Cosmos DB with timeout protection
      const cosmosStartTime = Date.now();
      try {
        await Promise.race([
          container.items.create(fileMetadata),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Cosmos DB save timeout after 25 seconds")), 25000)
          ),
        ]);
        const cosmosDuration = Date.now() - cosmosStartTime;
        console.log(`✅ [COSMOS SUCCESS] fileId: ${fileId}, duration: ${cosmosDuration}ms`);
      } catch (cosmosError) {
        const cosmosDuration = Date.now() - cosmosStartTime;
        console.error(`❌ [COSMOS SAVE FAILED] duration: ${cosmosDuration}ms, error: ${cosmosError.message}`);
        throw new Error(`Cosmos DB save failed: ${cosmosError.message}`);
      }

      const duration = Date.now() - startTime;
      console.log(`✨ [UPLOAD SUCCESS] id: ${fileId}, duration: ${duration}ms`);

      // Return success response
      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        file: {
          id: fileId,
          fileName: file.originalname,
          fileSize: file.size,
          mimeType: file.mimetype,
          uploadedAt: fileMetadata.uploadedAt,
          blobUrl: blockBlobClient.url,
        },
        duration: `${duration}ms`,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`❌ [UPLOAD ERROR] duration: ${duration}ms, error:`, error.message);
      console.error(`📋 [ERROR DETAILS]`, {
        name: error.name,
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });
      throw error;
    }
  })
);

// ========================================
// ENDPOINT 3: GET /
// Purpose: List all files for a user
// ========================================

router.get(
  "/",
  validateListQuery,
  asyncHandler(async (req, res) => {
    try {
      const { userId } = req.query;

      console.log(`Fetching files for user: ${userId}`);

      // Query Cosmos DB for all files of this user
      const query = "SELECT * FROM c WHERE c.userId = @userId ORDER BY c.uploadedAt DESC";
      const { resources: items } = await container.items
        .query(query, {
          parameters: [{ name: "@userId", value: userId }],
        })
        .fetchAll();

      console.log(`Found ${items.length} files for user: ${userId}`);

      // Return files list
      res.status(200).json({
        message: "Files retrieved successfully",
        count: items.length,
        files: items.map((item) => ({
          id: item.id,
          fileName: item.fileName,
          fileSize: item.fileSize,
          mimeType: item.mimeType,
          uploadedAt: item.uploadedAt,
          blobUrl: item.blobUrl,
          description: item.metadata?.description,
          tags: item.metadata?.tags,
        })),
      });
    } catch (error) {
      console.error("Fetch files error:", error);
      throw error;
    }
  })
);

// ========================================
// ENDPOINT 4: GET /:id
// Purpose: Get specific file metadata
// ========================================

router.get(
  "/:id",
  validateFileId,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      console.log(`Fetching file: ${id} for user: ${userId}`);

      // Query Cosmos DB for specific file
      const query = "SELECT * FROM c WHERE c.id = @id AND c.userId = @userId";
      const { resources: items } = await container.items
        .query(query, {
          parameters: [
            { name: "@id", value: id },
            { name: "@userId", value: userId },
          ],
        })
        .fetchAll();

      if (items.length === 0) {
        return res.status(404).json({
          error: {
            message: "File not found",
          },
        });
      }

      const file = items[0];

      console.log(`File found: ${id}`);

      // Return file metadata
      res.status(200).json({
        message: "File retrieved successfully",
        file: {
          id: file.id,
          fileName: file.fileName,
          fileSize: file.fileSize,
          mimeType: file.mimeType,
          uploadedAt: file.uploadedAt,
          updatedAt: file.updatedAt,
          blobUrl: file.blobUrl,
          description: file.metadata?.description,
          tags: file.metadata?.tags,
        },
      });
    } catch (error) {
      console.error("Fetch file error:", error);
      throw error;
    }
  })
);

// ========================================
// ENDPOINT 5: DELETE /:id
// Purpose: Delete file from both Blob & Cosmos DB
// ========================================

router.delete(
  "/:id",
  validateFileId,
  asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      console.log(`Deleting file: ${id} for user: ${userId}`);

      // Query Cosmos DB to get file details (especially blobName)
      const query = "SELECT * FROM c WHERE c.id = @id AND c.userId = @userId";
      const { resources: items } = await container.items
        .query(query, {
          parameters: [
            { name: "@id", value: id },
            { name: "@userId", value: userId },
          ],
        })
        .fetchAll();

      if (items.length === 0) {
        return res.status(404).json({
          error: {
            message: "File not found",
          },
        });
      }

      const file = items[0];

      // Delete from Blob Storage
      const blobClient = blobContainer.getBlockBlobClient(file.blobName);
      await blobClient.delete();
      console.log(`Blob deleted: ${file.blobName}`);

      // Delete from Cosmos DB
      await container.item(file.id, userId).delete();
      console.log(`Cosmos DB record deleted: ${file.id}`);

      // Return success response
      res.status(200).json({
        message: "File deleted successfully",
        deletedFile: {
          id: file.id,
          fileName: file.fileName,
        },
      });
    } catch (error) {
      console.error("Delete file error:", error);
      throw error;
    }
  })
);

// ========================================
// TEST ENDPOINTS (for debugging)
// ========================================

// Test upload - validates file but doesn't save to Azure
router.post(
  "/upload-test",
  upload.single("file"),
  validateFileMetadata,
  validateFileUpload,
  (req, res) => {
    console.log(`📤 [TEST UPLOAD] Handler invoked!`);
    console.log(`   File: ${req.file ? req.file.originalname : 'NONE'}`);
    console.log(`   Size: ${req.file ? req.file.size : 'N/A'} bytes`);
    
    try {
      const fileId = uuidv4();
      res.status(200).json({
        success: true,
        message: "Test upload successful (file NOT saved to Azure)",
        file: {
          id: fileId,
          fileName: req.file.originalname,
          fileSize: req.file.size,
          userId: req.body.userId,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// ========================================
// ERROR ROUTES
// ========================================

// 404 handler for unknown routes
router.use((req, res) => {
  res.status(404).json({
    error: {
      message: "Route not found",
      path: req.path,
      method: req.method,
    },
  });
});

module.exports = router;
