/**
 * Environment Validation Middleware
 * 
 * Validates that all required environment variables are set
 * before the server starts processing requests.
 */

const validateEnvironment = () => {
    const requiredEnvVars = [
        'COSMOS_ENDPOINT',
        'COSMOS_KEY',
        'AZURE_STORAGE_CONNECTION_STRING',
        'CONTAINER_NAME'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        console.error('❌ CRITICAL: Missing required environment variables:');
        missingVars.forEach(varName => {
            console.error(`   - ${varName}`);
        });
        console.error('\n⚠️  Please set these environment variables before running the server.');
        console.error('\n📝 Example .env file:');
        console.error('   COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/');
        console.error('   COSMOS_KEY=your-cosmos-key');
        console.error('   AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...');
        console.error('   CONTAINER_NAME=files');
        
        // Don't exit immediately - allow running in degraded mode for development
        console.warn('\n⚠️  Starting in DEGRADED MODE - Azure services may not be available');
        return false;
    }

    console.log('✅ All required environment variables are set');
    console.log('   ✓ COSMOS_ENDPOINT:', process.env.COSMOS_ENDPOINT.substring(0, 50) + '...');
    console.log('   ✓ COSMOS_KEY:', 'Set (length: ' + process.env.COSMOS_KEY.length + ')');
    console.log('   ✓ AZURE_STORAGE_CONNECTION_STRING: Set');
    console.log('   ✓ CONTAINER_NAME:', process.env.CONTAINER_NAME);

    return true;
};

module.exports = { validateEnvironment };
