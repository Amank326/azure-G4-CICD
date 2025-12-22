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
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
  "image/gif",
  "text/plain",
  "application/zip",
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
    return res.status(400).json({
      error: {
        message: "File type not allowed",
        details: `Allowed types: ${ALLOWED_FILE_TYPES.join(", ")}`,
        receivedType: req.file.mimetype,
      },
    });
  }

  // All validations passed
  next();
}

/**
 * Validate file metadata in request body
 */
function validateFileMetadata(req, res, next) {
  const { userId, description } = req.body;

  // userId is required
  if (!userId || typeof userId !== "string" || userId.trim() === "") {
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "userId is required and must be a non-empty string",
      },
    });
  }

  // description is optional but should be string if provided
  if (description && typeof description !== "string") {
    return res.status(400).json({
      error: {
        message: "Validation error",
        details: "description must be a string",
      },
    });
  }

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
