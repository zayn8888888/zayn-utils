# Zayn Utils

A utility library for web3 tools with proxy support and Matrix messaging capabilities.

## Installation

```bash
npm install zayn-utils

```

## Usage

### ESM

```javascript
import {
  askQuestion,
  createProxyAgent,
  sleep,
  log,
  initSendMsg,
} from "zayn-utils";
```

### CommonJS

```javascript
const {
  askQuestion,
  createProxyAgent,
  sleep,
  log,
  initSendMsg,
} = require("zayn-utils");
```

## Features

- Proxy Support : HTTP/HTTPS and SOCKS proxy agents
- Matrix Messaging : Send messages to Matrix rooms
- Utility Functions : Sleep, logging, retry mechanisms
- Queue Management : Task queues with concurrency control
- Interactive CLI : Ask questions in terminal

## API

### Utility Functions

- sleep(time) - Sleep for specified time
- log - Enhanced logging with colors
- askQuestion(prompt) - Interactive CLI questions
- fnCanRetry(fn, maxCount) - Retry function wrapper

### Proxy Functions

- createProxyAgent(proxyString) - Create proxy agent
- checkProxy(agent) - Verify proxy connectivity
- loadProxies(path) - Load proxies from file

### Matrix Messaging

- initSendMsg(config) - Initialize Matrix messaging

### Queue Management

- createQueue(concurrency, fn) - Create task queue
- createProcess(tasks, fn, proxies, concurrence) - Process tasks with proxies

## peerDependencies

Some features require additional dependencies:

- Browser automation features: `npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth windows-shortcuts`
- Encrypted messaging features: `npm install matrix-js-sdk@37.5.0`

## License

MIT
