/*
 * udp-tunnel-cli
 *
 * Copyright (c) 2016 Thomas Baumbach tom@xolo.pw
 *
 * Licensed under the MIT License
 */

'use strict';

const helper = require('./helper');

if (process.argv.length !== 4) {
    console.log('usage:', 'udp-tunnel-server', '<listen-port> <tunnel-port>');
    process.exit(-1);
}

const udp = require('dgram');

const port_listen = parseInt(process.argv[2]),
      port_tunnel = parseInt(process.argv[3]),
      server_listen = udp.createSocket('udp4'),
      server_tunnel = udp.createSocket('udp4');

// the tunnel connection (=unicorn)
var unicorn = null,
    unicorn_buf = null;

// SERVER LISTEN
server_listen.on('error', (err) => {
    console.log(`listen-server error:\n${err.stack}`);
    server_listen.close();
});
server_listen.on('message', (msg, rinfo) => {
    if (!unicorn)
    {
        console.log(`error: no tunnel connection set while listen-server contacted by ${rinfo.address}:${rinfo.port}`);
    }
    else
    {
        let rinfo_buf = helper.rinfo2buffer(rinfo),
            new_msg = Buffer.concat([rinfo_buf, msg], rinfo_buf.length + msg.length);
        server_tunnel.send(new_msg, 0, new_msg.length, unicorn.port, unicorn.address, (err) => { if (err) throw err; });
    }
    //console.log(`listen server got: ${msg} from ${helper.rinfo2buffer(rinfo).toString('hex')}`);
});
server_listen.on('listening', () => {
    var address = server_listen.address();
    console.log(`listen-server listening ${address.address}:${address.port}`);
});
server_listen.bind(port_listen);

// SERVER TUNNEL
server_tunnel.on('error', (err) => {
    console.log(`tunnel-server error:\n${err.stack}`);
    server_tunnel.close();
});
server_tunnel.on('message', (msg, rinfo) => {
    if (!unicorn)
    {
        console.log(`tunnel connection set for ${rinfo.address}:${rinfo.port}`);
        unicorn = rinfo;
        unicorn_buf = helper.rinfo2buffer(rinfo);
    }
    else
    {
        let rinfo = helper.buffer2rinfo(msg);
        server_listen.send(msg.slice(6), 0, msg.length-6, rinfo.port, rinfo.address, (err) => { if (err) throw err; });
    }
    //console.log(`tunnel server got: ${msg} from ${helper.rinfo2buffer(rinfo).toString('hex')}`);
});
server_tunnel.on('listening', () => {
    var address = server_tunnel.address();
    console.log(`tunnel-server listening ${address.address}:${address.port}`);
});
server_tunnel.bind(port_tunnel);
