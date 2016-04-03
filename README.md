# udp-tunnel-cli

> A tiny command-line toolkit to tunnel any UDP connection/socket to another machine.

`udp-tunnel-cli` lets you tunnel any UDP connection/socket. This makes it possible to tunnel listening UDP sockets from one machine to any other endpoint on a different machine (i.e. through firewalls).

## Install

Install this package globally using [NPM](https://www.npmjs.com/). Most OS need you to be root (e.g. using `sudo`) to install a global npm package:

```sh
$ npm -g install udp-unnel-cli
```

`udp-tunnel-cli` depends on [Node.js](https://nodejs.org/) and no other modules. Tested with `node v4.3.0`.

## Usage: server

Start the new endpoint for your tunnel. `tunnel-port` will wait for the tunnel connection to be set up - initiated by `udp-tunnel-client`. `listen-port` will wait for incoming connections and redirect them through the tunnel.

```sh
$ udp-tunnel-server <listen-port> <tunnel-port>
```

## Usage: client

Start the client (the actual tunnel). Contact the remote server to register the `udp-tunnel-client` and setup the local server's endpoint you want to tunnel.

```sh
$ udp-tunnel-client <remote-addr> <remote-tunnel-port> <local-addr> <local-port>
```

## ToDo/Nice-To-Have

* password protection on handshake
* keep-alive heartbeat
* encryption
* compression

## Support

Found a bug? Open an issue [here](https://github.com/thbaumbach/node-udp-tunnel-cli/issues) on Github.

Wanna help? Submit a pull request or contact me.

Wanna tip me a beer? Use [Bitcoin](bitcoin:14pSD9AmuNhLDbGRXehxbhwzRSRrkpiAKg): 14pSD9AmuNhLDbGRXehxbhwzRSRrkpiAKg

## License

Copyright (c) 2016 Thomas Baumbach <tom@xolo.pw>

Licensed under the MIT License
