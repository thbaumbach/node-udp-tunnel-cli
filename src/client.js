/*
 * udp-tunnel-cli
 *
 * Copyright (c) 2016 Thomas Baumbach tom@xolo.pw
 *
 * Licensed under the MIT License
 */

'use strict';

const helper = require('./helper');

if (process.argv.length !== 6) {
    console.log('usage:', 'udp-tunnel-client', '<remote-addr> <remote-tunnel-port> <local-addr> <local-port>');
    process.exit(-1);
}

const udp = require('dgram');

const tunnel_addr = process.argv[2],
      tunnel_port = parseInt(process.argv[3]),
      local_addr  = process.argv[4],
      local_port  = parseInt(process.argv[5]),
      client_tunnel  = udp.createSocket('udp4'),
      clients = {};

// CLIENT TUNNEL
client_tunnel.on('error', (err) => {
    console.log(`tunnel-client error:\n${err.stack}`);
    client_tunnel.close();
});
client_tunnel.on('message', (msg, rinfo) => {
    let client_rinfo = helper.buffer2rinfo(msg),
        client_rinfo_buf = msg.slice(0,6),
        client_rinfo_str = `${client_rinfo.address}:${client_rinfo.port}`;
    if (!(client_rinfo_str in clients))
    {
        console.log(`new client connected from ${client_rinfo_str}`)
        clients[client_rinfo_str] = udp.createSocket('udp4');
        clients[client_rinfo_str].client_rinfo_buf = client_rinfo_buf;
        clients[client_rinfo_str].on('error', (err) => {
            console.log(`client error:\n${err.stack}`);
            //server_tunnel.close(); //?
        });
        clients[client_rinfo_str].on('message', (msg, rinfo) => {
            let new_msg = Buffer.concat([clients[client_rinfo_str].client_rinfo_buf, msg], clients[client_rinfo_str].client_rinfo_buf.length + msg.length);
            client_tunnel.send(new_msg, 0, new_msg.length, tunnel_port, tunnel_addr, (err) => { if (err) throw err; });
            //console.log(`client got: ${msg} from ${helper.rinfo2buffer(rinfo).toString('hex')}`);
        });
    }
    clients[client_rinfo_str].send(msg.slice(6), 0, msg.length-6, local_port, local_addr, (err) => { if (err) throw err; });
    //console.log(`tunnel client got: ${msg} from ${helper.rinfo2buffer(rinfo).toString('hex')}`);
});
client_tunnel.send(new Buffer(1), 0, 1, tunnel_port, tunnel_addr, (err) => { if (err) throw err; }); // say hello
