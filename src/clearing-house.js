const fs = require('fs');
const path = require('path');
const tap3Decoder = require('./decoder');
const tap3Encoder = require('./encoder');

function processTAP3Files() {
    const folder = path.join(__dirname, 'messages');

    if (!fs.existsSync(folder)) {
        console.log('No messages to process.');
        return;
    }

    const files = fs.readdirSync(folder);

    files.forEach((file) => {
        const filePath = path.join(folder, file);
        const buffer = fs.readFileSync(filePath);
        const decodedMessage = tap3Decoder.decode(buffer);

        console.log('');
        console.log(`Processing file: ${file}`);
        console.log('--- Header ---');
        console.log(decodedMessage.header);

        console.log('--- CDRs ---');
        decodedMessage.cdrs.forEach((cdr, index) => {
            console.log(`CDR ${index + 1}:`, cdr);
        });

        console.log('--- Trailer ---');
        console.log(decodedMessage.trailer);

        simulateClearingProcess(decodedMessage);
        console.log('');

        fs.unlinkSync(filePath);
    });
}

function simulateClearingProcess(message) {
    console.log(`Clearing file from ${message.header.sender} to ${message.header.receiver}, Total Charge: ${message.trailer.totalCharge}`);
}

function generateTAP3Files() {
    const folder = path.join(__dirname, 'messages');
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    const interval = Math.floor(Math.random() * 2000) + 1000;

    setTimeout(() => {
        const message = generateTAP3File();
        const fileName = path.join(folder, `message_${Date.now()}.tap3`);
        fs.writeFileSync(fileName, message);
        console.log(`Generated TAP3 message: ${fileName}`);

        generateTAP3Files();
    }, interval);
}

function generateCDR() {
    // 0: voice, 1: sms, 2: data
    const callType = Math.floor(Math.random() * 3);
    let cdr = {
        callType: callType,
        charge: Math.floor(Math.random() * 10000)
    };

    if (callType === 0) {
         // 1 - 3600 seconds
        cdr.callDuration = Math.floor(Math.random() * 3600);
    } else if (callType === 2) {
         // 100 KB to 10 MB
        cdr.dataVolume = Math.floor(Math.random() * 10000);
    }

    return cdr;
}

function generateTAP3File() {
    const header = {
        sender: `Operator_${Math.floor(Math.random() * 1000)}`,
        receiver: `Operator_${Math.floor(Math.random() * 1000)}`,
        timestamp: new Date().toISOString().slice(0, 19) + 'Z'
    };

    const cdrCount = Math.floor(Math.random() * 10) + 1;
    const cdrs = [];
    let totalCharge = 0;

    for (let i = 0; i < cdrCount; i++) {
        const cdr = generateCDR();
        totalCharge += cdr.charge;
        cdrs.push(cdr);
    }

    const trailer = {
        totalCDRs: cdrCount,
        totalCharge: Math.floor(totalCharge)
    };

    const tap3File = { header, cdrs, trailer };

    return tap3Encoder.encode(tap3File, 'der');
}

module.exports = { processTAP3Files, generateTAP3Files };
