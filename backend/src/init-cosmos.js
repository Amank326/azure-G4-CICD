const { CosmosClient } = require("@azure/cosmos");
require("dotenv").config();

async function initializeDatabase() {
  const endpoint = process.env.COSMOS_ENDPOINT;
  const key = process.env.COSMOS_KEY;

  if (!endpoint || !key) {
    console.log("❌ Azure credentials not found in .env file");
    return false;
  }

  const client = new CosmosClient({ endpoint, key });

  try {
    // Create or get database
    const { database } = await client.databases.createIfNotExists({
      id: "file-notes-db",
    });

    console.log("✅ Database 'file-notes-db' ready");

    // Create or get container
    const { container } = await database.containers.createIfNotExists({
      id: "files",
      partitionKey: "/id",
    });

    console.log("✅ Container 'files' ready");

    // Insert sample data if empty
    try {
      const { resources: items } = await container.items.query(
        "SELECT * FROM c"
      ).fetchAll();

      if (items.length === 0) {
        const sampleData = {
          id: "sample-file-1",
          filename: "Sample Document.pdf",
          size: 1024000,
          uploadedAt: new Date().toISOString(),
          type: "pdf",
          notes: "Sample file for demonstration",
        };

        await container.items.create(sampleData);
        console.log("✅ Sample data inserted");
      } else {
        console.log(`✅ Found ${items.length} existing files`);
      }
    } catch (err) {
      console.log("⚠️  Could not query data:", err.message);
    }

    return true;
  } catch (error) {
    console.log("❌ Initialization error:", error.message);
    return false;
  }
}

if (require.main === module) {
  initializeDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { initializeDatabase };
