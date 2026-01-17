#!/usr/bin/env node

/**
 * 🧪 Quick Deployment Verification Script
 * 
 * Run this in browser console to verify all endpoints are working
 */

console.log('%c🚀 STARTING DEPLOYMENT VERIFICATION...', 'color: green; font-size: 16px; font-weight: bold;');
console.log('%c================================', 'color: blue; font-size: 14px;');

const BASE_URL = 'https://file-manager-backend-app.azurewebsites.net';
const RESULTS = {};

// Test 1: Health Check
(async () => {
    console.log('\n📌 TEST 1: Health Check');
    try {
        const response = await fetch(`${BASE_URL}/health`, {
            signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
            const data = await response.json();
            RESULTS.health = '✅ PASS';
            console.log('%c✅ PASS', 'color: green; font-weight: bold;');
            console.log('Response:', data);
        } else {
            RESULTS.health = '❌ FAIL';
            console.log(`%c❌ FAIL (Status: ${response.status})`, 'color: red; font-weight: bold;');
        }
    } catch (error) {
        RESULTS.health = '❌ ERROR';
        console.log('%c❌ ERROR', 'color: red; font-weight: bold;');
        console.error('Error:', error.message);
    }
})();

// Test 2: Diagnostics Endpoint
setTimeout(async () => {
    console.log('\n📌 TEST 2: Diagnostics Endpoint');
    try {
        const response = await fetch(`${BASE_URL}/api/files/diagnostics`, {
            signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
            const data = await response.json();
            RESULTS.diagnostics = '✅ PASS';
            console.log('%c✅ PASS', 'color: green; font-weight: bold;');
            console.log('Environment Variables:');
            Object.entries(data.environment || {}).forEach(([key, val]) => {
                console.log(`  ${key}: ${val ? '✓' : '✗'}`);
            });
            console.log('Azure Services:');
            console.log(`  Blob Storage: ${data.blobStorage}`);
            console.log(`  Cosmos DB: ${data.cosmosDB}`);
        } else {
            RESULTS.diagnostics = '❌ FAIL';
            console.log(`%c❌ FAIL (Status: ${response.status})`, 'color: red; font-weight: bold;');
        }
    } catch (error) {
        RESULTS.diagnostics = '❌ ERROR';
        console.log('%c❌ ERROR', 'color: red; font-weight: bold;');
        console.error('Error:', error.message);
    }
}, 1000);

// Test 3: CORS Configuration
setTimeout(async () => {
    console.log('\n📌 TEST 3: CORS Configuration');
    try {
        const response = await fetch(`${BASE_URL}/api/files/diagnostics`, {
            signal: AbortSignal.timeout(5000),
        });
        
        if (response.ok) {
            const data = await response.json();
            const frontendUrl = 'https://file-manager-frontend-app.azurewebsites.net';
            const hasCors = data.cors && data.cors.some(origin => 
                origin === frontendUrl || origin === frontendUrl + '/'
            );
            
            if (hasCors) {
                RESULTS.cors = '✅ PASS';
                console.log('%c✅ PASS', 'color: green; font-weight: bold;');
                console.log('Frontend URL is in CORS allowedOrigins');
            } else {
                RESULTS.cors = '⚠️ WARNING';
                console.log('%c⚠️ WARNING', 'color: orange; font-weight: bold;');
                console.log('Frontend URL NOT found in CORS origins');
                console.log('Allowed origins:', data.cors);
            }
        }
    } catch (error) {
        console.log('Could not verify CORS');
    }
}, 2000);

// Summary
setTimeout(() => {
    console.log('\n%c================================', 'color: blue; font-size: 14px;');
    console.log('%c✅ VERIFICATION COMPLETE', 'color: green; font-size: 16px; font-weight: bold;');
    console.log('\nResults Summary:');
    Object.entries(RESULTS).forEach(([test, result]) => {
        console.log(`  ${test}: ${result}`);
    });
    console.log('\n📝 If all tests PASS, file upload should work with retry mechanism!');
    console.log('💡 Try uploading a file now and watch the console for retry logs.\n');
}, 3000);
