/*
 * udp-tunnel-cli
 *
 * Copyright (c) 2016 Thomas Baumbach tom@xolo.pw
 *
 * Licensed under the MIT License
 */

'use strict';

module.exports.rinfo2buffer = (rinfo) => {
    let ip = rinfo.address.split('.'),
        buf = new Buffer(6);
    buf.writeUInt8(parseInt(ip[0]), 0);
    buf.writeUInt8(parseInt(ip[1]), 1);
    buf.writeUInt8(parseInt(ip[2]), 2);
    buf.writeUInt8(parseInt(ip[3]), 3);
    buf.writeUInt16BE(parseInt(rinfo.port), 4);
    return buf; 
}

module.exports.buffer2rinfo = (buf) => {
    return {
        address : `${buf.readUInt8(0)}.${buf.readUInt8(1)}.${buf.readUInt8(2)}.${buf.readUInt8(3)}`,
        port : buf.readUInt16BE(4)
    }; 
}
