# Telegram-Bot Example

[![API](https://img.shields.io/badge/TelegramAPI-4.8-green)](https://core.telegram.org/bots/api) [![winston](https://img.shields.io/badge/winston-3.3.3%2B-green)](https://www.npmjs.com/package/winston) [![node](https://img.shields.io/badge/node->%3D12-green)](https://nodejs.org/en/) [![Telegraf](https://img.shields.io/badge/telegraf.js-3.38-green)](https://www.npmjs.com/package/telegraf) 

This is a simple Telegram-Bot based on JS and the Telegraf package.

  - Fast Setup
  - Custom Commands
  - Basic mysql example Inclued


### Tech
This Bot uses open source software:
* [node.js](https://nodejs.org/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Telegraf](https://www.npmjs.com/package/telegraf) - Modern Telegram BotFramework for Node.js
* [mysql](https://www.npmjs.com/package/mysql) - awesome mysql driver
* [winston](https://www.npmjs.com/package/winston) - awsome logger library 


### Installation
Requirements:
* [Node.js](https://nodejs.org/) v12+
* [mysql](https://www.npmjs.com/package/mysql) v2+
* [Telegraf](https://www.npmjs.com/package/telegraf) v3+
* [winston](https://www.npmjs.com/package/winston) - v3+

To install node v12 run the following commands:
```sh
$ sudo apt update
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
$ sudo apt -y install nodejs
```
Install the dependencies fast with the npm installer:
```sh
$ cd telegram-Bot
$ npm install
```

add your Bot-Token and if needed your Databe login in the `config.mjs`

to run this Bot simply use
```sh
$ node bot.mjs
```

## Recommendation
It will be usefull to run this Bot via a [screen](https://wiki.ubuntuusers.de/Screen/) session.

### Development
Want to contribute? Great!
Just Create a Pull requests


### Todos
 - Write MORE Examples
 - Add general mysql functionality

License
----

GNU GENERAL PUBLIC LICENSE v3+
