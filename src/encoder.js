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

const schema = asn1.define('TAP3File', function () {
    this.seq().obj(
        this.key('header').use(Header),
        this.key('cdrs').seqof(CDR),
        this.key('trailer').use(Trailer)
    );
});

const encode = function(data) {
    return schema.encode(data, 'der');
}

module.exports = { encode };