const { processTAP3Files, generateTAP3Files } = require('./clearing-house.js');

// Start generating TAP3 messages (simulating receiving messages from a network)
generateTAP3Files();

// Process TAP3 files every 5 seconds
setInterval(() => {
    console.log('Processing TAP3 messages...');
    processTAP3Files();
}, 5000);

