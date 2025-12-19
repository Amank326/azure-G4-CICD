const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// In-memory storage for demo (will be reset on server restart)
let files = [];

const upload = multer({ storage: multer.memoryStorage() });

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET all files
router.get('/', async (req, res) => {
    try {
        res.json(files);
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ error: 'Failed to fetch files' });
    }
});

// GET single file (download)
router.get('/:fileId', (req, res) => {
    try {
        const file = files.find(f => f.id === req.params.fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Read from local filesystem
        const filePath = path.join(uploadsDir, file.id);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found on disk' });
        }

        res.setHeader('Content-Type', file.contentType);
        res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);
        res.sendFile(filePath);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ error: 'Failed to download file' });
    }
});

// POST new file
router.post('/', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        const fileId = Date.now() + '-' + req.file.originalname.replace(/\s+/g, '_');
        const filePath = path.join(uploadsDir, fileId);

        // Save file to disk
        fs.writeFileSync(filePath, req.file.buffer);

        const newFile = {
            id: fileId,
            name: req.file.originalname,
            notes: req.body.notes || '',
            contentType: req.file.mimetype,
            fileSize: req.file.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        files.push(newFile);

        res.status(201).json(newFile);
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

// PUT update notes
router.put('/:fileId', (req, res) => {
    try {
        const file = files.find(f => f.id === req.params.fileId);
        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        file.notes = req.body.notes || file.notes;
        file.updatedAt = new Date().toISOString();

        res.json(file);
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ error: 'Failed to update file' });
    }
});

// DELETE file
router.delete('/:fileId', (req, res) => {
    try {
        const index = files.findIndex(f => f.id === req.params.fileId);
        if (index === -1) {
            return res.status(404).json({ error: 'File not found' });
        }

        const file = files[index];
        const filePath = path.join(uploadsDir, file.id);

        // Delete from filesystem
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        files.splice(index, 1);

        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});

module.exports = router;
