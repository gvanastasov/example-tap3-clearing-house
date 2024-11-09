const BN = require('bn.js');
const asn1 = require('asn1.js');

const CDR = asn1.define('CDR', function () {
    this.seq().obj(
        this.key('callType').enum({ 0: 'voice', 1: 'sms', 2: 'data' }),
        this.key('charge').int(),
        this.key('callDuration').int().optional(),
        this.key('dataVolume').int().optional()
    );
});

const Header = asn1.define('Header', function () {
    this.seq().obj(
        this.key('sender').utf8str(),
        this.key('receiver').utf8str(),
        this.key('timestamp').gentime()
    );
});

const Trailer = asn1.define('Trailer', function () {
    this.seq().obj(
        this.key('totalCDRs').int(),
        this.key('totalCharge').int()
    );
});

const TAP3File = asn1.define('TAP3File', function () {
    this.seq().obj(
        this.key('header').use(Header),
        this.key('cdrs').seqof(CDR),
        this.key('trailer').use(Trailer)
    );
});

function decode(buffer) {
    var decodedData = TAP3File.decode(buffer, 'der');
    return convertToReadable(decodedData)
}

function convertToReadable(decodedData) {
    for (let key in decodedData) {
        if (Buffer.isBuffer(decodedData[key])) {
            decodedData[key] = decodedData[key].toString('utf-8');
        } else if (decodedData[key] instanceof BN) {
            decodedData[key] = decodedData[key].toNumber();
        } else if (typeof decodedData[key] === 'object' && decodedData[key] !== null) {
            decodedData[key] = convertToReadable(decodedData[key]);
        }
    }
    return decodedData;
}

module.exports = { decode };