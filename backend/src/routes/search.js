const express = require('express');
const router = express.Router();
const { CosmosClient } = require('@azure/cosmos');

const cosmosClient = new CosmosClient({ 
    endpoint: process.env.COSMOS_ENDPOINT, 
    key: process.env.COSMOS_KEY 
});
const database = cosmosClient.database('file-notes-db');
const container = database.container('files');

// Search files by name or notes
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const searchQuery = `
            SELECT * FROM c 
            WHERE CONTAINS(LOWER(c.name), LOWER(@query)) 
               OR CONTAINS(LOWER(c.notes), LOWER(@query))
            ORDER BY c.updatedAt DESC
        `;

        const { resources: items } = await container.items
            .query(searchQuery, { parameters: [{ name: '@query', value: query }] })
            .fetchAll();

        res.json(items);
    } catch (error) {
        console.error('Error searching files:', error);
        res.status(500).json({ error: 'Failed to search files' });
    }
});

// Filter files by type/category
router.get('/filter/category', async (req, res) => {
    try {
        const { category } = req.query;
        
        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        let query = 'SELECT * FROM c';
        const params = [];

        if (category !== 'all') {
            query += ' WHERE c.category = @category';
            params.push({ name: '@category', value: category });
        }

        query += ' ORDER BY c.updatedAt DESC';

        const { resources: items } = await container.items
            .query(query, { parameters: params })
            .fetchAll();

        res.json(items);
    } catch (error) {
        console.error('Error filtering files:', error);
        res.status(500).json({ error: 'Failed to filter files' });
    }
});

// Get file statistics
router.get('/stats/summary', async (req, res) => {
    try {
        const { resources: items } = await container.items.readAll().fetchAll();
        
        const stats = {
            totalFiles: items.length,
            totalSize: items.reduce((sum, file) => sum + (file.fileSize || 0), 0),
            byType: {},
            byCategory: {},
            recentFiles: items.slice(0, 5)
        };

        items.forEach(file => {
            const ext = file.name?.split('.').pop() || 'unknown';
            stats.byType[ext] = (stats.byType[ext] || 0) + 1;
            stats.byCategory[file.category || 'uncategorized'] = 
                (stats.byCategory[file.category || 'uncategorized'] || 0) + 1;
        });

        res.json(stats);
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ error: 'Failed to get statistics' });
    }
});

module.exports = router;
