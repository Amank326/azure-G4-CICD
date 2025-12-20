const express = require('express');
const router = express.Router();
const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { CosmosClient } = require('@azure/cosmos');

// Initialize Azure clients
const cosmosClient = new CosmosClient({ 
    endpoint: process.env.COSMOS_ENDPOINT, 
    key: process.env.COSMOS_KEY 
});
const database = cosmosClient.database('file-notes-db');
const container = database.container('files');

const blobServiceClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
    process.env.CONTAINER_NAME || 'files'
);

const upload = multer({ storage: multer.memoryStorage() });

// GET all files
router.get('/', async (req, res) => {
    try {
        const { resources: items } = await container.items.readAll().fetchAll();
        console.log('Files fetched:', items.length);
        res.json(Array.isArray(items) ? items : []);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch files', details: error.message });
    }
});

// GET a specific file for download
router.get('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const blockBlobClient = containerClient.getBlockBlobClient(fileId);
        
        // Check if blob exists
        const exists = await blockBlobClient.exists();
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Get the file metadata from Cosmos
        const { resources: items } = await container.items
            .query(`SELECT * FROM c WHERE c.id = @fileId`, { parameters: [{ name: '@fileId', value: fileId }] })
            .fetchAll();

        if (items.length === 0) {
            return res.status(404).json({ error: 'File metadata not found' });
        }

        const fileMetadata = items[0];

        // Download blob
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody);

        res.setHeader('Content-Disposition', `attachment; filename="${fileMetadata.name}"`);
        res.setHeader('Content-Type', fileMetadata.contentType);
        res.send(buffer);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

// POST a new file
router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const blobName = new Date().getTime() + '-' + req.file.originalname;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        
        // Upload to blob storage
        await blockBlobClient.upload(req.file.buffer, req.file.size);

        // Create metadata in Cosmos DB
        const newItem = {
            id: blobName,
            name: req.file.originalname,
            notes: req.body.notes || '',
            blobUrl: blockBlobClient.url,
            contentType: req.file.mimetype,
            fileSize: req.file.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const { resource: createdItem } = await container.items.create(newItem);

        res.status(201).json(createdItem);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: error.message || 'Failed to upload file' });
    }
});

// PUT - Update file notes
router.put('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;
        const { notes } = req.body;

        // Query to get the item first
        const { resources: items } = await container.items
            .query(`SELECT * FROM c WHERE c.id = @fileId`, { parameters: [{ name: '@fileId', value: fileId }] })
            .fetchAll();

        if (items.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        const item = items[0];
        item.notes = notes || item.notes;
        item.updatedAt = new Date().toISOString();

        const { resource: updatedItem } = await container.item(fileId, fileId).replace(item);

        res.json(updatedItem);
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ error: 'Failed to update file', details: error.message });
    }
});

// DELETE a file
router.delete('/:fileId', async (req, res) => {
    try {
        const { fileId } = req.params;

        // First verify file exists in Cosmos
        const { resources: items } = await container.items
            .query(`SELECT * FROM c WHERE c.id = @fileId`, { parameters: [{ name: '@fileId', value: fileId }] })
            .fetchAll();

        if (items.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Delete from blob storage
        const blockBlobClient = containerClient.getBlockBlobClient(fileId);
        try {
            await blockBlobClient.delete();
        } catch (blobError) {
            console.warn('Warning deleting blob:', blobError.message);
        }

        // Delete from Cosmos DB
        const item = items[0];
        await container.item(fileId, fileId).delete();

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file', details: error.message });
    }
});

// Helper function to convert stream to buffer
async function streamToBuffer(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        readableStream.on('error', reject);
    });
}

module.exports = router;
