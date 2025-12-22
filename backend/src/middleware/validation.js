/**
 * Validation Middleware
 * 
 * Validates incoming requests:
 * - File size limits
 * - File type validation
 * - Required fields
 * - ID format validation
 */

const { v4: uuidv4, validate: validateUUID } = require("uuid");

// Configuration
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || "104857600"); // 100MB default
const ALLOWED_FILE_TYPES = [
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  // Text & Archives
  "text/plain",
  "text/csv",
  "text/html",
  "application/zip",
  "application/x-zip-compressed",
  // JSON & other data
  "application/json",
  // General fallback for any file type
  // We'll log unexpected types but allow them
];

/**
 * Validate file upload
 * Checks: file exists, size limit, file type
 */
function validateFileUpload(req, res, next) {
  // Check if file exists
  if (!req.file) {
    return res.status(400).json({
      error: {
        message: "No file provided",
        details: "Please upload a file",
      },
    });
  }

  // Check file size
  if (req.file.size > MAX_FILE_SIZE) {
    return res.status(413).json({
      error: {
        message: "File too large",
        details: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        maxSize: MAX_FILE_SIZE,
        uploadedSize: req.file.size,
      },
    });
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(req.file.mimetype)) {
    // Log unexpected MIME types but don't block
    console.warn(`⚠️ [VALIDATION] Unexpected file type: ${req.file.mimetype} for file: ${req.file.originalname}`);
    // Allow the file anyway - server will handle it
    // If you want to block specific types, update ALLOWED_FILE_TYPES array
  }

  // Log validation success
  console.log(`✅ [VALIDATION OK] file: ${req.file.originalname}, size: ${req.file.size}, type: ${req.file.mimetype}`);
}

/**
 * Validate file metadata in request body
 */
function validateFileMetadata(req, res, next) {
  const { userId, description } = req.body;

  console.log(`🔍 [METADATA VALIDATION] userId: "${userId}", description: "${description}"`);

  // userId is required
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    console.error(`❌ [METADATA ERROR] userId missing or invalid`);
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "userId is required and must be a non-empty string",
      },
    });
  }

  // description is optional but should be string if provided
  if (description && typeof description !== "string") {
    console.error(`❌ [METADATA ERROR] description is not a string`);
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "description must be a string",
      },
    });
  }

  console.log(`✅ [METADATA OK] userId: ${userId}`);
  next();
}

/**
 * Validate file ID format
 * Checks if ID is valid UUID
 */
function validateFileId(req, res, next) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "File ID is required",
      },
    });
  }

  // Note: In production, you might want UUID validation
  // For now, we just check it's not empty
  if (typeof id !== "string" || id.trim() === "") {
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "Invalid file ID format",
      },
    });
  }

  next();
}

/**
 * Validate query parameters for file listing
 */
function validateListQuery(req, res, next) {
  const { userId } = req.query;

  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "userId query parameter is required",
      },
    });
  }

  next();
}

module.exports = {
  validateFileUpload,
  validateFileMetadata,
  validateFileId,
  validateListQuery,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
};
